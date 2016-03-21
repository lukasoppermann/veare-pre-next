<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\PostsService as Posts;

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
        return view('blog.listing', [
            'posts' => $posts->all()
        ]);
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
}
