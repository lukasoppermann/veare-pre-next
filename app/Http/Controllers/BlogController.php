<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use League\CommonMark\CommonMarkConverter;
use Storage;

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

        foreach($articles as $article)
        {
            $metadata = [];
            preg_match('#---\n(.*?)---\n#is', Storage::get($article), $d);
            if(count($d) > 0){
                foreach(array_filter(explode("\n", $d[1])) as $data){
                    $data = explode(':',$data);
                    $metadata[trim($data[0])] = trim($data[1]);
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
            $data = explode(':',$data);
            $metadata[trim($data[0])] = trim($data[1]);
        }
        $converter = new CommonMarkConverter();
        $post = $converter->convertToHtml($article);


        $metainfo = '<div class="o-meta publication-info">Published by <a class="author" href="http://vea.re/blog" rel="author">Lukas Oppermann</a>, <time datetime="'.$this->getDate($name).'" class="article_time">'.$this->getDate($name).'</time></div>';

        $post = str_replace('{$meta}', $metainfo, $post);

        return view('blog.post', ['post' =>  $post, 'link' => $name, 'title' => $metadata['title'] ]);
    }

}
