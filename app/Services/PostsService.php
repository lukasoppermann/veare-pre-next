<?php

namespace App\Services;

use Storage;
use Carbon\Carbon;
use Cache;
use League\CommonMark\Converter;
use League\CommonMark\DocParser;
use League\CommonMark\Environment;
use League\CommonMark\HtmlRenderer;
use Webuni\CommonMark\AttributesExtension\AttributesExtension;
use Bookworm\Bookworm;

Class PostsService {
    /**
     * the format the dates will be converted to
     *
     * @var string
     */
    // protected $date_format = 'F d, Y';
    protected $date_format = 'F d, Y';
    /**
     * data that will be in meta element
     *
     * @var string
     */
    protected $available_meta = [
        'tags'          => 'meta_tags',
        'author'        => 'meta_default',
        'description'   => 'meta_default',
        'preview'       => 'meta_default',
        'series'        => 'meta_series',
        'next'          => 'meta_default',
        'previous'      => 'meta_default',
        'category'      => 'meta_category'
    ];
    /**
     * posts array
     *
     * @var array
     */
    protected $posts = [];

    /**
     * regex to retrieve meta-info from content
     *
     * @var string
     */
    protected $meta_regex = '#^---\n(.*?)---\n#is';
    /**
     * prepare posts
     *
     * @method __construct
     */
    public function __construct(){
        // if cache does not exist: create
        if (!Cache::has('posts') || env('APP_ENV') === 'local') {
            $this->buildCache();
        }
        // store posts from cache in class variable
        $this->posts = Cache::get('posts');
    }
    /**
     * get list of all posts as array
     *
     * @method all
     *
     * @return array
     */
    public function all(){
        return $this->posts;
    }
    /**
     * get individual post
     *
     * @method get
     *
     * @param  string $link
     *
     * @return array
     */
    public function get($link){
        $key = array_search($link, array_column($this->posts, 'link'));
        if($key !== false){
            return $this->posts[$key];
        }
        return false;
    }
    /*
     * builds up the cache with all articles
     */
    private function buildCache(){
        // clear post cache
        Cache::forget('posts');
        // renew post cache
        Cache::rememberForever('posts', function() {
            return $this->getPosts();
        });
    }
    /*
     * gets all files and returns posts as array
     */
    private function getPosts(){

        foreach(Storage::files('articles') as $file)
        {
            if (pathinfo($file)['extension'] === 'md') {
                $articles[] = array_merge([
                    'link' => $this->getLink($file),
                    'date' => $this->getDate($file, $this->date_format),
                    'machine_date' => $this->getDate($file, 'Y-m-d'),
                ], $this->getDataFromFile($file));
            }
        }
        return $this->sortArticles($articles);
    }
    /**
     * Sort articles
     */
    private function sortArticles($articles)
    {

        usort($articles, function($a, $b){
            $aDate = substr(trim($a['link'],'-'),0,6);
            $bDate = substr(trim($b['link'],'-'),0,6);

            if (is_numeric($aDate) && !is_numeric($bDate)) {
                return -1;
            } else if(!is_numeric($aDate) && is_numeric($bDate)) {
                return 1;
            } else {
                return ($aDate < $bDate) ? 1 : -1;
            }
        });

        return $articles;
    }
    /**
     * Get link from filename
     */
    private function getLink($filename)
    {
        return pathinfo($filename)['filename'];
    }
    /**
     * Get formatted date from filename
     */
    private function getDate($filename, $format)
    {
        $date = $this->formatDate(substr($this->getLink($filename),0,6), $format);

        if ($date !== false) {
            return $date;
        }

        return env('APP_ENV') === 'local' ? 'draft' : false;
    }
    /**
     * format date
     */
    private function formatDate($date, $format){
        try {
            $date = Carbon::createFromDate('20'.substr($date,0,2), substr($date,2,2), substr($date,4,2));
        }
        catch(\InvalidArgumentException $e)
        {
            return false;
        }

        return $date->format($format);
    }
    /**
     * Get data from file
     */
    private function getDataFromFile($file)
    {
        $fileContent = Storage::get($file);

        $htmlContent = $this->getContent($fileContent);

        return array_merge_recursive([
            'content' => $htmlContent,
            'meta' => [
                'readingTime' => $this->getReadingTime($htmlContent),
            ],
        ], $this->getMetaData($fileContent, $this->getTitle($file)));
    }
    /**
     * get reading time
     */
    private function getReadingTime($file){
        return Bookworm::estimate($file, false);
    }
    /**
     * Get content from string
     */
    private function getContent($fileContent)
    {
        $content = preg_replace($this->meta_regex, "", $fileContent);

        $environment = Environment::createCommonMarkEnvironment();
        $environment->addExtension(new AttributesExtension());

        $converter = new Converter(
            new DocParser($environment),
            new HtmlRenderer($environment)
        );

        return $converter->convertToHtml($content);
    }
    /**
     * Get formatted title from filename
     */
    private function getTitle($filename)
    {
        $title = $this->getLink($filename);

        if( is_numeric(substr($title, 0, 6)) ){
            $title = substr($title, 6);
        }

        return trim(str_replace('-',' ',$title));
    }
    /**
     * Get metadata from string
     */
    private function getMetaData($fileContent, $title = "No title provided")
    {
        preg_match($this->meta_regex, $fileContent, $data);

        $data = $this->extractMeta($data);

        // set title if in meta info, otherwise use fallback from argument
        if( isset($data['title']) ) {
            $title = $data['title'];
        }

        // loop through meta and run every item through defined function
        foreach($this->available_meta as $key => $function){
            $meta[$key] = $this->$function( $data, $key );
        }

        return [
            'meta' => $meta,
            'title' => $title
        ];
    }
    /**
     * extract meta info from string
     */
    private function extractMeta($data){
        // if no meta data exists return false
        if(!isset($data[1])){
            return false;
        }
        // split rows into array
        $data = array_filter(explode("\n", $data[1]));
        // split at colon into key value pair
        foreach($data as $key => $item){
            unset($data[$key]);
            $item = preg_split('~\\\:(*SKIP)(*FAIL)|:~',$item);
            $data[$item[0]] = str_replace('\:',':',trim($item[1]));
        };

        return $data;
    }
    /**
     * Check for existance and return
     */
    private function meta_default($data, $key){
        if (isset($data[$key])){
            return $data[$key];
        }

        return false;
    }
    /**
     *	prepare tags
     */
    private function meta_tags($data, $key){
        if( $item = $this->meta_default($data, $key)) {
            $tags = array_map('trim', explode(',',$item));
            return array_filter($tags);
        }

        return false;
    }
    /**
     *	prepare categories
     */
    private function meta_category($data, $key){
        $categories = [
            'life',
            'code',
            'design'
        ];

        $item = $this->meta_default($data, $key);

        if( isset($item) && in_array($item, $categories)) {
            return $categories[array_search($item, $categories)];
        }

        return $categories[0];
    }
    /**
     *	prepare series
     */
    private function meta_series($data, $key){
        $item = $this->meta_default($data, $key);
        if( !$item || strpos($item,';') === false ){
            return false;
        }
        list($series, $part) = explode(';', $item);
        return [
            'part' =>  isset($part) ? trim($part): 1,
            'name' => trim($series)
        ];
    }

}
