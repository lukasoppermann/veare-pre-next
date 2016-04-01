@extends('master')
@section('content')
    <article class="o-article" itemprop="mainEntityOfPage" itemid="{{url('blog/')}}/{!!$link!!}" itemscope itemtype="http://schema.org/BlogPosting">
        <link itemprop="mainEntityOfPage" href="{{url('blog/')}}/{!!$link!!}" />
        <p><a title="Back to the list of articles" class="o-link o-link--back" href="{{url('blog/')}}">Back to overview</a></p>

        <h1 itemprop="headline">{!!$title!!}</h1>
        @include('blog.meta', $meta)
        {!!$content!!}
        <p><a title="Back to the list of articles" class="o-link o-link--back" href="{{url('blog/')}}">Back to overview</a></p>
    </article>
    <div class="o-article__comment">
        I am interested in your feedback, please share your thoughts with me <a class="o-link o-link--decorated" title="Reply to my article with a tweet" href="https://twitter.com/intent/tweet?text={{urlencode($title)}} {{url('blog/'.$link)}}%20via%20%40lukasoppermann&source=webclient">via Twitter</a>.
    </div>
    @include('footer')
@endsection
