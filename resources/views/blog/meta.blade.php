<div class="o-article__meta">
    Published
    @if ($author !== false)
        by <span itemprop="author" itemscope itemtype="http://schema.org/Person"><a class="author" href="https://twitter.com/lukasoppermann" itemprop="url" title="about {!!$author!!}" rel="author"><span itemprop="name">{!!$author!!}</span></a></span> / <a itemprop="publisher" itemprop="http://schema.org/Organization" itemscope href="http://vea.re"><span itemprop="name">vea.re</span></a>,
    @endif
    <time class="article_time" itemprop="datePublished" datetime="{{$machine_date}}">{!!$date!!}</time> •
    <time datetime="{!!$readingTime!!}m">{!!$readingTime!!} min read</time>
</div>
