@if ($post['date'] !== false)
<li class="o-list-item o-post-preview">
    <time class="o-post-preview__date" datetime="{{$post['machine_date']}}">{{$post['date']}}</time>
    <a class="o-link c-post-preview-title" href="{{url('blog/'.$post['link'])}}">
        {{$post['title'] or 'No title provided'}}
    </a>
    <p>{{$post['meta']['extract']}}</p>
</li>
@endif
