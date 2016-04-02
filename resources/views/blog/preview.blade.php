@if ($post['date'] !== false)
<li class="o-list-item o-article-preview o-article-preview--{{$post['meta']['category']}}" itemprop="blogPost" itemscope itemtype="http://schema.org/BlogPosting">
    <div class="o-article-preview__meta">
        <time itemprop="datePublished" class="o-article-preview__date" datetime="{{$post['machine_date']}}">{{$post['date']}}</time>
        <a href="" class="o-article-preview__category o-article-preview__category--blue" date-category="{{$post['meta']['category']}}">{{$post['meta']['category']}}</a>
    </div>
    <a itemprop="url" class="o-article-preview__link" title="Read: {{$post['title'] or 'No title provided'}}" href="{{url('blog/'.$post['link'])}}">
    <link itemprop="mainEntityOfPage" href="{{url('blog/'.$post['link'])}}" />
        @if( $post['meta']['series'] !== false )
            <h4 class="o-article-preview__series">{{$post['meta']['series']['name']}} – part {{$post['meta']['series']['part']}}:</h4>
        @endif
        <h3 class="o-article-preview__title" itemprop="name headline">{{$post['title'] or 'No title provided'}}</h3>
        <p class="o-article-preview__excerpt" itemprop="description">{{$post['meta']['preview']}}</p>
    </a>
</li>
@endif
