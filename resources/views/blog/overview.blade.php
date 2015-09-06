@extends('template')
@section('content')
    <div>
        <h1>field notes</h1>
        <p class="c-blog-intro">I am a freelance interaction designer & web developer. I write about design, ux, code and the perfect working environment.</p>
    </div>
    @each('blog.preview', $files, 'file')
@endsection
