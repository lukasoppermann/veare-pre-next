@extends('master')
@section('content')
    <a title="Back to the list of articles" class="o-link o-link--back" href="{{url('blog/')}}">Back to overview</a>
    <article class="o-post__content">
        {!!$post!!}
    </article>
    <div class="o-footer">
        <a title="Back to the list of articles" class="o-link o-link--back" href="{{url('blog/')}}">Back to overview</a>
    </div>
@endsection

@section('footer')
    <div class="o-footer__item">
        I am interested in your feedback, please share your thoughts with me <a class="o-link o-link--decorated" title="Reply to my article with a tweet" href="https://twitter.com/intent/tweet?text={{urlencode($title)}} {{url('blog/'.$link)}}%20via%20%40lukasoppermann&source=webclient">via Twitter</a>.
    </div>
@endsection
