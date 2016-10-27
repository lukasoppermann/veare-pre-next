@extends('master')
@section('content')
    <article class="o-article" itemprop="mainEntityOfPage" itemid="{{url('blog/')}}/{!!$link!!}" itemscope itemtype="http://schema.org/BlogPosting">
        <link itemprop="mainEntityOfPage" href="{{url('blog/')}}/{!!$link!!}" />
        <p><a title="Back to the list of articles" class="o-link o-link--back" href="{{url('blog/')}}">Back to overview</a></p>

        <h1 itemprop="headline">{!!$title!!}</h1>
        @include('blog.meta', $meta)
        <aside class="o-ads-top">
            <!-- Responsive Ad -->
            <script type="text/javascript">
                google_ad_client = "ca-pub-7108083868453613";
                google_ad_slot = "8120384489";
                google_ad_width = 336;
                google_ad_height = 280;
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
        <ins class="adsbygoogle o-ads__slot--wide"
             style="display:inline-block"
             data-ad-client="ca-pub-7108083868453613"
             data-ad-slot="3273212487"
             {{-- data-ad-format="auto" --}}
             ></ins>
             <script type="text/javascript"
             src="//pagead2.googlesyndication.com/pagead/show_ads.js">
             </script>
    </aside>
    <script>
        window.setTimeout(function(){
            (adsbygoogle = window.adsbygoogle || []).push({});
        },500);
    </script>
    @include('footer')
@endsection
