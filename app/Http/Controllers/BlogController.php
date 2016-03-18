<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\PostsService as Posts;
use Storage;

class BlogController extends Controller
{
    private $metadata = [];
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(Posts $posts)
    {
        // $articles = Storage::files('articles');
        // rsort($articles);
        // foreach($articles as $article)
        // {
        //     $metadata = [];
        //     preg_match('#---\n(.*?)---\n#is', Storage::get($article), $d);
        //     if(count($d) > 0){
        //         foreach(array_filter(explode("\n", $d[1])) as $data){
        //             $data = preg_split('~\\\:(*SKIP)(*FAIL)|:~',$data);
        //             $metadata[trim($data[0])] = str_replace('\:',':',trim($data[1]));
        //         }
        //     }
        //
        //     $article_file = pathinfo($article)['filename'];
        //
        //     $article_list[] = array_merge([
        //         'link' => $article_file,
        //         'title' => $this->getTitle($article_file),
        //         'date' => $this->getDate($article_file)
        //     ], $metadata);
        // }
        //
        // $article_list = isset($article_list) ? $article_list: [];
        return view('blog.listing', ['files' => $posts->all()]);
    }
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show(Posts $posts, $link)
    {

        $post = $posts->get($link);

        if( $post === false ) {
            return redirect()->action('BlogController@index');
        }

        return view('blog.post', $post);
    }
    /*
     * get post by name
     */
    // private function getPostContent($name){
    //     // check if valid link
    //     if( !Storage::exists('articles/'.$name.'.md') ) {
    //         return false;
    //     }
    //     // regex to find meta info
    //     $meta_regex = '#^---\n(.*?)---\n#is';
    //     // get file
    //     $file = Storage::get('articles/'.$name.'.md');
    //     // get meta info
    //     preg_match($meta_regex, $file, $meta);
    //     $meta = $this->getMeta($meta);
    //     // add date
    //     $meta['date'] = $this->getDate($name);
    //
    //     return [
    //         'link' => $name,
    //         'title' => $this->getTitle($name, $meta),
    //         'content' => $this->getContent(preg_replace($meta_regex,'', $file), $meta, $meta_regex),
    //         'meta' =>  $meta
    //     ];
    // }
    // /**
    //  * get content
    //  */
    // private function getContent($file, $meta, $meta_regex){
    //     // convert to html
    //     $converter = new CommonMarkConverter();
    //     $post = $converter->convertToHtml($file);
    //
    //     $metaView = view()->make('blog.meta', [
    //         'author' => isset($meta['author']) ? $meta['author'] : false,
    //         'date' => $meta['date'],
    //         'readingTime' => $this->getReadingTime($post)
    //     ]);
    //     $metaInfo = $metaView->render();
    //
    //     return str_replace('{$meta}', $metaInfo, $post);
    // }
    // /**
    //  * add metda info to post content
    //  */
    // private function getMeta($meta){
    //     // if no meta data exists return false
    //     if(!isset($meta[1])){
    //         return false;
    //     }
    //     // split rows into array
    //     $data = array_filter(explode("\n", $meta[1]));
    //     // split at colon into key value pair
    //     foreach($data as $key => $item){
    //         unset($data[$key]);
    //         $item = preg_split('~\\\:(*SKIP)(*FAIL)|:~',$item);
    //         $data[$item[0]] = str_replace('\:',':',trim($item[1]));
    //     };
    //     // replace {$meta} with actual content
    //     return $data;
    // }
    // /**
    //  * get reading time
    //  */
    // private function getReadingTime($file){
    //     return Bookworm::estimate($file, false);
    // }
    // /*
    //  * get next or previous part by filename and return link
    //  */
    // private function getPart($partType, $template){
    //
    //     if (!isset($this->metadata[$partType])) {
    //         return false;
    //     }
    //     $file = glob(storage_path().'/app/articles/[0-9][0-9][0-9][0-9][0-9][0-9]-'.$this->metadata[$partType].'.md');
    //
    //     if( count($file) > 0 ){
    //         $link = str_replace(storage_path().'/app/articles/','',str_replace('.md','',$file[0]));
    //         return view('blog.'.$template, ['link' => $link])->render();
    //     }
    // }
}
