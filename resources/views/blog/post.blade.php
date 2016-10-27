@extends('master')
@section('content')
    <article class="o-article" itemprop="mainEntityOfPage" itemid="{{url('blog/')}}/{!!$link!!}" itemscope itemtype="http://schema.org/BlogPosting">
        <link itemprop="mainEntityOfPage" href="{{url('blog/')}}/{!!$link!!}" />
        <p><a title="Back to the list of articles" class="o-link o-link--back" href="{{url('blog/')}}">Back to overview</a></p>

        <h1 itemprop="headline">{!!$title!!}</h1>
        @include('blog.meta', $meta)
        <aside class="o-ads-top">
            <!-- Responsive Ad -->
            <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
            <!-- Rectangle -->
            <ins class="adsbygoogle"
                 style="display:inline-block;width:336px;height:280px"
                 data-ad-client="ca-pub-7108083868453613"
                 data-ad-slot="8120384489"></ins>
            <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
            <!-- Rectangle -->
        </aside>
        {!!$content!!}
        <p><a title="Back to the list of articles" class="o-link o-link--back" href="{{url('blog/')}}">Back to overview</a></p>
    </article>
    <div class="o-article__comment">
        I am interested in your feedback, please share your thoughts with me <a class="o-link o-link--decorated" title="Reply to my article with a tweet" href="https://twitter.com/intent/tweet?text={{urlencode($title)}} {{url('blog/'.$link)}}%20via%20%40lukasoppermann&source=webclient">via Twitter</a>.
    </div>
    <aside class="o-ads">
        <!-- Responsive Ad -->
        <!-- Responsive Ad -->
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-7108083868453613"
             data-ad-slot="3273212487"
             {{-- data-ad-format="auto" --}}
             ></ins>
        <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
    </aside>
    @include('footer')
@endsection
