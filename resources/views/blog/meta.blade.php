<div class="o-article__meta">
    Published
    @if ($author !== false)
        by <span itemprop="author" itemscope itemtype="http://schema.org/Person"><a class="author" href="http://vea.re" itemprop="url" title="about {!!$author!!}" rel="author"><span itemprop="name">{!!$author!!}</span></a></span>,
    @endif
    <time class="article_time" itemprop="datePublished" datetime="{{$machine_date}}">{!!$date!!}</time> •
    <time datetime="{!!$readingTime!!}m">{!!$readingTime!!} min read</time>
</div>
