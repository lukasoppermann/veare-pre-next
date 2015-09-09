---
title: Why you should always write your own blogging software
---
# Why you should always write your own blogging software
{$meta}
Okay, maybe I lied a bit. There is not "always" on the internet. But sometimes it might really be a good idea to look past the off the shelf products like wordpress or medium.

## The truth about blogging
What do you think is the most important part about your blog? The SEO so people find it? Maybe its the social media integration so your articles are easy to share? Maybe its the design, that has to be perfect? Definitely not, there is only one thing that is important about your blog: **It needs good content**. Nothing else matters, everything else can be added on afterwards. If I have an idea I want to start typing immediately. This is why I choose to blog by using markdown files.

## Alternatives
Before we dive in, lets look at the alternatives: Wordpress is pretty powerful, but also very complicated and personally I do not enjoy the writing experience using wordpress. Ghost & Medium have a much better writing experience, but they still have problems. You can not easily write offline (I once lost an entire article, because Medium lost it when coming back online). Also while you might be able to download your data, it is not always easy use it in a different system.

## Setting a goal
We want to get to writing posts as fast as possible, so we need to define an MVP. To start with we only need two page types, a listing of all articles and an individual article. All this is powered by markdown files. Thats it, everything else is a bonus we can add once we have our first posts online.

**Our toolset will include the following:**
- [Laravel](http://laravel.com/) as the php framework of choice
- The [league/commonmark](https://github.com/thephpleague/commonmark) package for parsing markdown files

So lets get started ...

## The setup for our blog
First we need to install laravel and pull in the commonmark package. I am expecting you to have [composer](https://getcomposer.org/) up and running.

```shell
composer create-project laravel/laravel --prefer-dist yourBlog
cd yourBlog
composer require league/commonmark --prefer-dist
```

Now we need to add our first post, so `cd` into `yourBlog` and run the following.

```shell
mkdir storage/app/articles
echo -e "#First Post\nAll in markdown, nice." >> storage/app/articles/150901-first-post.md
```

At this point to probably want to init git for versioning in this project so go ahead and do this. Once you are done, you will notice that the `git status` does not include our posts. This is a problem, because we want to track our posts in git, this is the only versioning we have. So quickly open the `storage/app/.gitignore` file in your favorite editor edit it to look like the following, afterwards you should be able to add your posts to the git history.

```shell
/*
!/articles/
!.gitignore
```

## Building the article listing
We are already very close to starting to write our first blog post, all we need to do is build the logic to list & display the posts. We will do this very dirty and look at refactoring it into a nice, clean way, later on.

First we setup our routes, I use a path of `/blog`, as you might want to add other sections later on, when you decide to flash out the blog into a full website or add it into your current website.

```php
Route::get('/blog', 'BlogController@index');
Route::get('/blog/{article}', 'BlogController@show');
```

Now go ahead, create the controller and open it in your favorite text editor. This can be easily done within the terminal from the project folder.

```shell
php artisan make:controller --plain BlogController
open app/Http/Controllers/BlogController.php
```

We need to add two methods to respond to our two routes: `index()` and `show()`. Lets start with `index()`, the listing of our posts. We need to be able to get the files, so we need it `use` the laravel `Storage` facade, and while we do it, we may as well import the commonmark package which we are going to use in the show method.

```php
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use League\CommonMark\CommonMarkConverter;
use Storage;

class BlogController extends Controller
{
```

Done! Now we add the index method which loads all articles. By default it searches in `storage/app` so if we just provide `articles` as a parameter we will get every file within `atorage/app/articles`. We have to loop through all returned files to build up an `$articles_list` array, which has a link, date and title of every blog post. We prefix all our posts why a date in the format `YYMMDD` like `150901` which lets us retrieve the date from the file name and has the added advantage of automatically sorting our files by publication date (descending). After all this is done we just pass this array to the view `views/blog/overview.blade.php`, which we will create in a bit.

```php
/**
 * Display a listing of the resource.
 *
 * @return Response
 */
public function index()
{
    $articles = Storage::files('articles');

    foreach($articles as $article)
    {
        $article_file = pathinfo($article)['filename'];

        $article_list[] = [
            'link' => $article_file,
            'title' => $this->getTitle($article_file),
            'date' => $this->getDate($article_file),
        ];
    }

    return view('blog.overview', ['articles' => $article_list]);
}
```

We are referenceing two private methods `getTitle` and `getDate` which we will create now. To get the title we just need to remove the first 7 characters of the filename (this is the date and the dash). Afterwards we replace the dashes with spaces.

```php
private function getTitle($filename)
{
    return str_replace('-',' ',substr($filename,7));
}
```

Retrieving the date is nearly as easy, you just need to cut the pieces of the date into parts and add them in the desired format. I opted for the european format DD.MM.YY. If you forgot it, `substr` works by providing the string, the position where to star from, and the amount of characters to substract.

```php
private function getDate($filename)
{
    return substr($filename,4,2).'.'.substr($filename,2,2).'.'.substr($filename,0,2);
}
```

All done here, we just need to add the views. We will add template view, for lack of a better name, which has our basic html like the head and loading our css, an overview template and a preview template. Previews are the individual listings and the overview is the container holding all of the items. We start with `views/template.blade.php`.

```html
<!DOCTYPE html>
<html>
    <head>
        <title>{{$title or 'Your default title'}}</title>
        <link href='{{asset('app.min.css')}}' rel='stylesheet' type='text/css'>
        <script>
            // I would probably add google analytics
        </script>
    </head>
    <body>
        <div class="o-container">
            @yield('content')
        </div>
    </body>
</html>
```
## Programming the article view

<h2 id="a-blog-in-progress">Sidenote: a blog in progess ...</h2>
This whole post and the entire blog is a work in progress which uses exactly this idea. I got frustrated with not publishing because of all the hassle associated with it, so now I am just writing markdown files and only concentrate on the content.
