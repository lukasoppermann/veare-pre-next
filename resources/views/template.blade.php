<!DOCTYPE html>
<html>
    <head>
        <title>{{$title or 'Web Development, User Experience & Design'}} – veare field notes</title>
        <link href='https://fonts.googleapis.com/css?family=Fira+Mono:400' rel='stylesheet' type='text/css'>
        <!-- <link href='https://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'> -->
        <link href='https://fonts.googleapis.com/css?family=Lato:400,700' rel='stylesheet' type='text/css'>
        <link href='{{asset('/css/app.min.css')}}' rel='stylesheet' type='text/css'>
    </head>
    <body>
        <div class="o-container">
            @yield('content')
        </div>
    </body>
</html>
