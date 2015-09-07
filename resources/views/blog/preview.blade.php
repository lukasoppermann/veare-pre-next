@if ($file['date'] !== false)
<li class="o-list-item">
    <span class="c-post-preview-time">{{$file['date']}}</span>
    <a class="o-link c-post-preview-title" href="{{url('blog/'.$file['link'])}}">
        {{$file['title'] or 'No title provided'}}
    </a>
</li>
@endif
