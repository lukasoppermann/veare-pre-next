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

class PostsService
{
    /**
     * The format the dates will be converted to.
     *
     * @var string
     */
    protected $date_format = 'F d, Y';

    /**
     * Data that will be in meta element.
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
        'category'      => 'meta_category',
    ];

    /**
     * Posts array.
     *
     * @var array
     */
    protected $posts = [];

    /**
     * Regex to retrieve meta-info from content.
     *
     * @var string
     */
    protected $meta_regex = '#^(?:\s)*---(?:\s)*\n(.*?)(?:\s)*---(?:\s)*\n#is';

    /**
     * Prepare posts.
     */
    public function __construct()
    {
        // if cache does not exist: create
        if (!Cache::has('posts') || env('APP_ENV') === 'local' || count(Cache::get('posts')) !== $this->getPostCount()) {
            $this->buildCache();
        }
        // getPostCount
        // store posts from cache in class variable
        $this->posts = Cache::get('posts');
    }

    /**
     * Get list of all posts as array.
     *
     * @return array
     */
    public function all()
    {
        return $this->posts;
    }

    /**
     * Get individual post.
     *
     * @param  string $link
     *
     * @return array
     */
    public function get($link)
    {
        $key = array_search($link, array_column($this->posts, 'link'));
        if ($key !== false) {
            return $this->posts[$key];
        }
        return false;
    }

    /**
     * Builds up the cache with all articles.
     */
    private function buildCache()
    {
        // clear post cache
        Cache::forget('posts');
        // renew post cache
        Cache::rememberForever('posts', function () {
            return $this->getPosts();
        });
    }

    /**
     * Gets all files and returns posts as array.
     *
     * @return array
     */
    private function getPosts()
    {
        foreach (Storage::files('articles') as $file) {
            if (isset(pathinfo($file)['extension']) && pathinfo($file)['extension'] === 'md') {
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
     * Gets post count
     *
     * @return array
     */
    private function getPostCount()
    {
        $count = 0;
        foreach (Storage::files('articles') as $file) {
            if (isset(pathinfo($file)['extension']) && pathinfo($file)['extension'] === 'md') {
                $count++;
            }
        }
        return $count;
    }
    /**
     * Sort articles.
     *
     * @return array
     */
    private function sortArticles($articles)
    {
        usort($articles, function ($a, $b) {
            $aDate = substr(trim($a['link'], '-'), 0, 6);
            $bDate = substr(trim($b['link'], '-'), 0, 6);

            if (is_numeric($aDate) && !is_numeric($bDate)) {
                return -1;
            } elseif (!is_numeric($aDate) && is_numeric($bDate)) {
                return 1;
            } else {
                return ($aDate < $bDate) ? 1 : -1;
            }
        });
        return $articles;

    }

    /**
     * Get link from filename.
     *
     * @return string
     */
    private function getLink($filename)
    {
        return pathinfo($filename)['filename'];
    }

    /**
     * Get formatted date from filename.
     *
     * @return mixed
     */
    private function getDate($filename, $format)
    {
        $date = $this->formatDate(substr($this->getLink($filename), 0, 6), $format);

        if ($date !== false) {
            return $date;
        }

        return env('APP_ENV') === 'local' ? 'draft' : false;
    }

    /**
     * Format date.
     *
     * @return mixed
     */
    private function formatDate($date, $format)
    {
        try {
            $date = Carbon::createFromDate('20'.substr($date, 0, 2), substr($date, 2, 2), substr($date, 4, 2));
        } catch (\InvalidArgumentException $e) {
            return false;
        }

        return $date->format($format);
    }

    /**
     * Get data from file.
     *
     * @return array
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
     * Get reading time.
     *
     * @return string
     */
    private function getReadingTime($file)
    {
        return Bookworm::estimate($file, false);
    }

    /**
     * Get content from string.
     *
     * @return string
     */
    private function getContent($fileContent)
    {
        $content = preg_replace($this->meta_regex, '', $fileContent);

        $environment = Environment::createCommonMarkEnvironment();
        $environment->addExtension(new AttributesExtension());

        $converter = new Converter(
            new DocParser($environment),
            new HtmlRenderer($environment)
        );

        return $converter->convertToHtml($content);
    }

    /**
     * Get formatted title from filename.
     *
     * @return string
     */
    private function getTitle($filename)
    {
        $title = $this->getLink($filename);

        if (is_numeric(substr($title, 0, 6))) {
            $title = substr($title, 6);
        }

        return trim(str_replace('-', ' ', $title));
    }

    /**
     * Get metadata from string.
     *
     * @return array
     */
    private function getMetaData($fileContent, $title = 'No title provided')
    {
        preg_match($this->meta_regex, $fileContent, $data);

        $data = $this->extractMeta($data);
        // set title if in meta info, otherwise use fallback from argument
        if (isset($data['title'])) {
            $title = $data['title'];
        }

        // loop through meta and run every item through defined function
        foreach ($this->available_meta as $key => $function) {
            $meta[$key] = $this->$function($data, $key);
        }

        return [
            'meta' => $meta,
            'title' => $title,
        ];
    }

    /**
     * Extract meta info from string.
     *
     * @return array
     */
    private function extractMeta($data)
    {
        // if no meta data exists return false
        if (!isset($data[1])) {
            return false;
        }
        // split rows into array
        $data = array_filter(explode("\n", $data[1]));
        // split at colon into key value pair
        foreach ($data as $key => $item) {
            unset($data[$key]);
            $item = preg_split('~\\\:(*SKIP)(*FAIL)|:~', $item);
            $data[strtolower($item[0])] = str_replace('\:', ':', trim($item[1]));
        };
        return $data;
    }

    /**
     * Check for existance and return.
     *
     * @return mixed
     */
    private function meta_default($data, $key)
    {
        return isset($data[$key]) ? $data[$key] : false;
    }

    /**
     * Prepare tags.
     *
     * @return mixed
     */
    private function meta_tags($data, $key)
    {
        if ($item = $this->meta_default($data, $key)) {
            $tags = array_map('trim', explode(',', $item));
            return array_filter($tags);
        }

        return false;
    }

    /**
     * Prepare categories.
     *
     * @return string
     */
    private function meta_category($data, $key)
    {
        $categories = [
            'life',
            'code',
            'design',
            'technology',
        ];

        $item = $this->meta_default($data, $key);

        if (isset($item) && in_array($item, $categories)) {
            return $categories[array_search($item, $categories)];
        }

        return $categories[0];
    }

    /**
     * Prepare series.
     *
     * @return array
     */
    private function meta_series($data, $key)
    {
        $item = $this->meta_default($data, $key);
        if (!$item || strpos($item, ';') === false) {
            return false;
        }
        list($series, $part) = explode(';', $item);

        return [
            'part' => isset($part) ? trim($part) : 1,
            'name' => trim($series),
        ];
    }
}
