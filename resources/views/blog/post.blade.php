@extends('template')
@section('content')
    <a class="o-link o-link--back" href="{{url('blog/')}}">Back to overview</a>
    {!!$post!!}
    <div class="o-footer">
        <a class="o-link o-link--back" href="{{url('blog/')}}">Back to overview</a>
    </div>
@endsection
