@if ($file['date'] !== false)
<li class="o-list-item">
    <time class="c-post-preview-time">{{$file['date']}}</time>
    <a class="o-link c-post-preview-title" href="{{url('blog/'.$file['link'])}}">
        {{$file['title'] or 'No title provided'}}
    </a>
    <p>{{$file['extract'] or ''}}</p>
</li>
@endif
