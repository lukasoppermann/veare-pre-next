<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
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
        $files = Storage::files('articles');

        foreach($files as $path)
        {
            $metadata = [];
            preg_match('#---\n(.*?)---\n#is', Storage::get($path), $d);
            if(count($d) > 0){
                foreach(array_filter(explode("\n", $d[1])) as $data){
                    $data = explode(':',$data);
                    $metadata[trim($data[0])] = trim($data[1]);
                }
            }

            $file_list[] = array_merge([
                'link' => pathinfo($path)['filename'],
                'date' => $this->getDate(pathinfo($path)['filename'])
            ], $metadata);
        }

        $file_list = isset($file_list) ? $file_list: [];
        return view('blog.overview', ['files' => $file_list]);
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

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($name)
    {
        if( Storage::exists('articles/'.$name.'.md') ) {
            $article = Storage::get('articles/'.$name.'.md');
            preg_match('#---\n(.*?)---\n#is', $article, $d);
            $article = preg_replace('#---\n(.*?)---\n#is', '', $article);
            foreach(array_filter(explode("\n", $d[1])) as $data){
                $data = explode(':',$data);
                $metadata[trim($data[0])] = trim($data[1]);
            }
            $converter = new CommonMarkConverter();
            $post = $converter->convertToHtml($article);
            return view('blog.post', ['post' =>  $post, 'title' => $metadata['title'] ]);
        }
    }

}
