<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use League\CommonMark\Converter;
use League\CommonMark\DocParser;
use League\CommonMark\Environment;
use League\CommonMark\HtmlRenderer;
use Webuni\CommonMark\AttributesExtension\AttributesExtension;
use Storage;
use Bookworm\Bookworm;

class BlogController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $articles = Storage::files('articles');
        rsort($articles);
        foreach($articles as $article)
        {
            $metadata = [];
            preg_match('#---\n(.*?)---\n#is', Storage::get($article), $d);
            if(count($d) > 0){
                foreach(array_filter(explode("\n", $d[1])) as $data){
                    $data = preg_split('~\\\:(*SKIP)(*FAIL)|:~',$data);
                    $metadata[trim($data[0])] = str_replace('\:',':',trim($data[1]));
                }
            }

            $article_file = pathinfo($article)['filename'];

            $article_list[] = array_merge([
                'link' => $article_file,
                'title' => $this->getTitle($article_file),
                'date' => $this->getDate($article_file)
            ], $metadata);
        }

        $article_list = isset($article_list) ? $article_list: [];
        return view('blog.listing', ['files' => $article_list]);
    }
    /**
     * Get formatted date from filename
     */
    private function getDate($filename)
    {
        if (!is_numeric(substr($filename,0,6))) {
            if (env('APP_ENV') === 'local') {
                return 'draft';
            }
            return false;
        }
        $date = substr($filename,4,2).'.'.substr($filename,2,2).'.'.substr($filename,0,2);
        return $date;
    }

    /**
     * Get formatted title from filename
     */
    private function getTitle($filename)
    {
        if(!is_numeric(substr($filename,0,6))){
            return str_replace('-',' ',$filename);
        }
        return str_replace('-',' ',substr($filename,7));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($name)
    {
        if( !Storage::exists('articles/'.$name.'.md') ) {
            return redirect()->action('BlogController@index');
        }

        $article = Storage::get('articles/'.$name.'.md');
        preg_match('#---\n(.*?)---\n#is', $article, $d);
        $article = preg_replace('#---\n(.*?)---\n#is', '', $article);
        foreach(array_filter(explode("\n", $d[1])) as $data){
            $data = preg_split('~\\\:(*SKIP)(*FAIL)|:~',$data);
            $metadata[trim($data[0])] = str_replace('\:',':',trim($data[1]));
        }

        $environment = Environment::createCommonMarkEnvironment();
        $environment->addExtension(new AttributesExtension());

        // reading time estimate
        $readingTime = Bookworm::estimate($article, false);

        $converter = new Converter(new DocParser($environment), new HtmlRenderer($environment));
        $post = $converter->convertToHtml($article);

        $metainfo = '<div class="o-meta publication-info">Published by <a class="author" href="http://vea.re" title="about Lukas Oppermann" rel="author">Lukas Oppermann</a>, <time datetime="'.$this->getDate($name).'" class="article_time">'.$this->getDate($name).'</time> • <time datetime="'.$readingTime.'m">'.$readingTime.' min read</time></div>';

        $post = str_replace('{$meta}', $metainfo, $post);

        $postData = array_merge(['post' =>  $post, 'link' => $name], $metadata);

        return view('blog.post', $postData);
    }

}
