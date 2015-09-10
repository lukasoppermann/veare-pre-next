@extends('master')
@section('content')
    <a class="o-link o-link--back" href="{{url('blog/')}}">Back to overview</a>
    <article class="o-post-content">
        {!!$post!!}
    </article>
    <div class="o-footer">
        <a class="o-link o-link--back" href="{{url('blog/')}}">Back to overview</a>
    </div>
@endsection
