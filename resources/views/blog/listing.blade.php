@extends('master')
@section('content')
    <div class="o-blog-listing__left">
        <div class="o-blog-listing__about js-blogImage">
            <a href="{{url('')}}" data-nav="#nav" class="o-logo">
        		<svg class="o-logo__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 141 116"><path class="o-logo__form o-logo__form--white" d="M81.365 13.826l-23.37 46.318L39.73 23.95h100.725L128.37 0H0l58.01 115 51.02-101.174"/><linearGradient id="a" gradientUnits="userSpaceOnUse" x1="75.999" y1="27" x2="103.999" y2="27"><stop offset="0" stop-opacity=".25"/><stop offset="1" stop-opacity=".05"/></linearGradient><path fill="url(#a)" d="M76 24h28l-2.938 6"/></svg>
        	</a>
        </div>
    </div>
    <div class="o-blog-listing__right">
        <ul class="o-list o-list--none c-list-postlist">
            @each('blog.preview', $posts, 'post')
        </ul>
        @include('footer')
    </div>
@endsection
