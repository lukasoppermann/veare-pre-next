<div class="o-article__meta">
    Published
    @if ($author !== false)
        by <a class="author" itemprop="author" href="http://vea.re" title="about {!!$author!!}" rel="author">{!!$author!!}</a>,
    @endif
    <time class="article_time" itemprop="datePublished" datetime="{{$machine_date}}">{!!$date!!}</time> •
    <time datetime="{!!$readingTime!!}m">{!!$readingTime!!} min read</time>
</div>
