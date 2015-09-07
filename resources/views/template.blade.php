<!DOCTYPE html>
<html>
    <head>
        <title>{{$title or 'Web Development, User Experience & Design'}} – veare field notes</title>
        <link href='https://fonts.googleapis.com/css?family=Fira+Mono:400' rel='stylesheet' type='text/css'>
        <link href='https://fonts.googleapis.com/css?family=Lato:400,700' rel='stylesheet' type='text/css'>
        <link href='{{asset(env("CSS_PATH").'app.min.css')}}' rel='stylesheet' type='text/css'>
        <script>
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

          ga('create', 'UA-7074034-1', 'auto');
          ga('send', 'pageview');
          ga('set', 'anonymizeIp', true);
        </script>
    </head>
    <body>
        <div class="o-container">
            @yield('content')
        </div>
    </body>
</html>
