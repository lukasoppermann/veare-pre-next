@extends('master')
@section('content')
    <div class="o-post-list">
        <h1>field notes</h1>
        <p class="c-blog-intro">I am a freelance interaction designer & web developer. I write about design, ux, code and the perfect working environment.</p>
        <p class="c-blog-intro">This blog is a <a title="Learn how to build a blog in Laravel" href="{{url('blog/-building-a-blog-with-laravel#a-blog-in-progress')}}">work in progress</a>, I am building it as I write, because I don't want to wait with writing until I have the perfect blog coded & designed. Expect dramatic changes and updates. :)</p>
        <p class="c-blog-intro">If you have comments to any of the articles or suggestions for improvments, please tweet me <a href="https://twitter.com/lukasoppermann" title="Follow Lukas Oppermann on Twitter">@lukasoppermann</a>.</p>
    </div>
    <ul class="o-list o-list--none">
        @each('blog.preview', $files, 'file')
    </ul>
@endsection
