@extends('template')
@section('content')
    <div class="o-post-list">
        <h1>field notes</h1>
        <p class="c-blog-intro">I am a freelance interaction designer & web developer. I write about design, ux, code and the perfect working environment.</p>
    </div>
    <ul class="o-list o-list--none">
        @each('blog.preview', $files, 'file')
    </ul>
@endsection
