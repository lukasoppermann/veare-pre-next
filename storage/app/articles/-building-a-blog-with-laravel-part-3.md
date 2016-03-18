---
title: Building a blog with Laravel\: Refactoring, caching and previews - PART 3
tags: tag1, tag2
author: Lukas Oppermann
description: Learn how to use laravels caching, the carbon date package and more to improve your laravel blog
extract: Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
---

> Our controller is growing and getting crowded, to get further with our blog its best to extract some logic to a service: the PostsService which will deal with getting, processing and caching our posts.

## Building a PostsService
Since all our data is in files, we are basically working with flat file storage instead of a database. This means we have an overhead of having to parse the markdown whenever we want to access information. To add more features we really need to add a cache which can provide us with very fast access to information like the list of posts or meta info for each post. This should also remove the need to parse the markdown every time a post is viewed.

Laravel already comes with a cache system, so we do not need to worry about the caching logic. Instead we will move all logic to read and parse posts into a new `PostService` class, which will include a cache. Let's start by creating the file `app/Services/PostsService.php`.

```php
<?php

namespace App\Services;
// we will be needing all those imports
use Bookworm\Bookworm;
use Cache;
use Carbon\Carbon;
use League\CommonMark\Converter;
use League\CommonMark\DocParser;
use League\CommonMark\Environment;
use League\CommonMark\HtmlRenderer;
use Storage;
use Webuni\CommonMark\AttributesExtension\AttributesExtension;

Class PostsService {
    /**
     * @var array
     */
    protected $posts;

    /**
     * @method __construct
     */
    public function __construct(){
        // if cache does not exist (or we are working locally): (re)build cache
        if (!Cache::has('posts') || env('APP_ENV') === 'local') {
            $this->buildCache();
        }
        // store posts from cache in class variable
        $this->posts = Cache::get('posts');
    }

}
```

The `__construct` of our new class `PostsService` checks if a cache exists, if it does not (or if we are working locally) we call `buildCache`, which will rebuild our cache for us. Afterwards we `Cache::get('posts')` and store the result in the class variable `$this->posts`. This way, if we ever want to update our caching logic we just need to change it in one place as we will be using `$this->posts` everywhere within the class.

## Caching posts using Laravels cache system
The `buildCache` method from the `__construct` method of our service class is pretty simple. All it does is delete the `posts` cache and afterwards recreate it, so updates and new articles will be included. We are using `rememberForever` which adds a cache item that never expires. This means we will need to manually clear the cache using `php artisan cache:clear` but in a later article we will automate this process to clear the `posts` cache whenever a new article or update is uploaded.

```php
/*
 * builds up the cache with all articles
 */
private function buildCache(){
    // clear post cache
    Cache::forget('posts');
    // renew post cache
    Cache::rememberForever('posts', function() {
        return $this->getPosts();
    });
}
```

Within the `rememberForever` method we are calling `getPosts`, which is in charge of retrieving the articles and parsing them. This functionality is currently implemented in the `BlogController` and will be removed once the `PostsService` is finished. The `getPosts` method and most of the other methods following are implemented as private methods, because they are internal and should not be used outside of our service. This is beneficial as it means we can change any private method as much as we want and not break anything, as long as the public methods return stays the same.

```php
    /*
     * reads all files and returns posts as array
     */
    private function getPosts(){

        foreach(Storage::files('articles') as $file)
        {
            if (pathinfo($file)['extension'] == 'md') {
                $articles[] = array_merge([
                    'link' => $this->getLink($file),
                    'date' => $this->getDate($file),
                ], $this->getDataFromFile($file));
            }
        }

        return $this->sortArticles($articles);
    }
```

The `getPosts` method grabs all files from our `articles` directory using Laravels `Storage` facade. We loop through the results, check if they are markdown files, and if so, add them to the `$articles` array once we parsed and formatted them. The array is returned sorted by the date in the filename in reverse chronological order.

### Formatting date & link
Within the `getPosts` method we calling `getLink` which returns the file name without the extension by using phps `pathinfo` function.

```php
/**
     * Get link from filename
     */
    private function getLink($filename)
    {
        return pathinfo($filename)['filename'];
    }
```

The `getDate` gets the date by passing the first 6 characters from `getLink` to `formatDate`, which will return a formatted date or `false`. We return the date if it is *not* `false`. If it is `false` we return `false`, which will make the post not show up in the list of posts. However in case we are in our local environment we return `draft` which will make the post show up, so you see your drafts locally, but not on your server.

```php
    /**
     * Get formatted date from filename
     */
    private function getDate($filename)
    {
        $date = $this->formatDate(substr($this->getLink($filename),0,6));

        if ($date !== false) {
            return $date;
        }

        return env('APP_ENV') === 'local' ? 'draft' : false;
    }
```

### Formatting the date using Carbon
As always, the more code you can delegate to open source, the better, so we are going to use the [`Carbon` package](http://carbon.nesbot.com/docs/) to deal with formatting our dates:

```php
/**
     * format date
     */
    private function formatDate($date){
        try {
            $date = Carbon::createFromDate('20'.substr($date,0,2), substr($date,2,2), substr($date,4,2));
        }
        catch(\InvalidArgumentException $e)
        {
            return false;
        }

        return $date->format($this->date_format);
    }
```

The `Carbon::createFromDate` needs year, month and day, which we can `substr` from the `$date` argument. For the year we need to add `20` because we formatted the date as `160321` without the leading `20`.

The `createFromDate` method throws an exception if the provided date is invalid. We will make use of this behavior, by catching the exception (our file is a draft) and returning `false`.

If the date is valid we use `Carbon`s format method, which needs a format string, which we will store in `$this->date_format` so it is easily adjustable.
For a simple european date you can add the string below to the very top of your file. The [php datetime formats](http://php.net/manual/en/datetime.formats.date.php) page has an overview of all available formatting options.

```php
/**
 * the format the dates will be converted to
 *
 * @var string
 */
protected $date_format = 'd/m/Y';
```

### Oh my, I am getting a headache from all those methods, why so many?
As a quick interlude let me address the fear of to many methods. Somehow there is an idea in some peoples heads, that we need to have as few functions as possible. Nothing could be further from the truth, you should always have as many functions as make sense. The two main reasons for extracting logic into a method are:

- logic is used in more than one instance (two already count!)
- an entire chunk of logic can be extracted

You only want to extract logic, if it is complete in itself. The goal is to make your code easier to understand, by extracting logic to a method with a name that makes it evident what the method does. For example `formatDate` is easy to understand, while `ifDateInvalidReturnFalse` does not help much.

### Extracting file data
Now lets get to `getDataFromFile`, the method which deals with everything that is in the actual markdown file. First we get the content of our markdown file using Laravels `Storage` facade and pass it to `getContent`. This method will return the converted html without our meta information at the top.

We want to return an array with the content, the title and the meta information. While most meta data is retrieved in the `getMetaData` method, the reading time estimation is done here, as we have the converted html available. We just copy the `getReadingTime` method from our `BlogController` into the `PostsService` and add it within a `meta` array.

```php
/**
 * Get data from file
 */
private function getDataFromFile($file)
{
    $fileContent = Storage::get($file);
    $htmlContent = $this->getContent($fileContent);

    return array_merge_recursive([
        'content' => $htmlContent,
        'meta' => [
            'readingTime' => $this->getReadingTime($htmlContent),
        ],
    ], $this->getMetaData($fileContent, $this->getTitle($file)));
}
```
### Converting markdown to html using CommonMark
As stated before the `getContent` method returns the converted html. But before we convert it, we need to remove the the meta information. For this we copy over the `$meta_regex` from the `BlogController`.

```php
/**
 * regex to retrieve meta-info from content
 *
 * @var string
 */
protected $meta_regex = '#^---\n(.*?)---\n#is';
```

In the `getContent` method we can now `preg_replace` the meta info using our `$this->meta_regex` variable. Afterwards you can either use the simple CommonMark conversion we used in the `BlogController` or go for the more advanced version if you fancy installing some [CommonMark extensions](https://github.com/thephpleague/commonmark#community-extensions). I am using the [CommonMark attribute extension](https://github.com/webuni/commonmark-attributes-extension), so I need to do the advanced setup:

1. Create a new CommonMark environment
2. Add the extension using `addExtension`
3. Create a new converter with the environment
4. Convert to html

```php
/**
 * Get content from string
 */
private function getContent($fileContent)
{
    $content = preg_replace($this->meta_regex, "", $fileContent);

    $environment = Environment::createCommonMarkEnvironment();
    $environment->addExtension(new AttributesExtension());

    $converter = new Converter(
        new DocParser($environment),
        new HtmlRenderer($environment)
    );

    return $converter->convertToHtml($content);
}
```

### Extracting meta data from markdown
The `getMetaData` method takes two arguments, the `$fileContent` from which to extract the meta information and a `$title` to use in case there was none provided in the meta information. For this title we use the result from the `getTitle` method. It uses the `getLink` to retrieve the filename and checks if the first 6 characters are numeric, if they are, we remove them. Afterwards we replace all `-` with spaces and `trim` the result before we return.

```php
/**
 * Get formatted title from filename
 */
private function getTitle($filename)
{
    $title = $this->getLink($filename);

    if( is_numeric(substr($title, 0, 6)) ){
        $title = substr($title, 6);
    }

    return trim(str_replace('-',' ',$title));
}
```
In `getMetaData` we first extract the meta info using our `$this->meta_regex` in `preg_match`. This will give us the entire text between the two `---`. This is to passed to the `extractMetaData` method, which is our old [`getMeta` method](160316-building-a-blog-with-laravel-part-2#extract-meta) from the `BlogController`, renamed to avoid confusion.
If the title was set in the meta section, we now replace `$title` which has been passed as the second argument with the title from the meta section.

```php
/**
 * Get metadata from string
 */
private function getMetaData($fileContent, $title = "No title provided")
{
    preg_match($this->meta_regex, $fileContent, $data);

    $data = $this->extractMetaData($data);

    // set title if in meta info, otherwise use fallback from argument
    if( isset($data['title']) ) {
        $title = $data['title'];
    }

    // loop through meta and run every item through defined function
    foreach($this->available_meta as $key => $function){
        $meta[$key] = $this->$function( $data, $key );
    }

    return [
        'meta' => $meta,
        'title' => $title
    ];
}
```

Afterwards we need to deal with the rest of the meta `$data`. For this we add a class variable `$available_meta` which is an array with the key being the meta item (e.g. *author*) and the value being a function which is used to *parse* this item.

```php
/**
 * data that will be in meta element
 *
 * @var string
 */
protected $available_meta = [
    'tags'          => 'meta_tags',
    'author'        => 'meta_default',
    'description'   => 'meta_default',
    'extract'       => 'meta_default',
    'next'          => 'meta_default',
    'previous'      => 'meta_default',
];
```

Now we can use this array in a `foreach`, run the specified function on the data and store the result in the `$meta` variable using the `$key`.

```php
// loop through meta and run every item through defined function
foreach($this->available_meta as $key => $function){
    $meta[$key] = $this->$function( $data, $key );
}
```

As you can see above, for most items we just use the `meta_default`, which returns the item if it exists or returns `false` if the item does not exist.

```php
/**
 * Check for existence and return
 */
private function meta_default($data, $key){
    if (isset($data[$key])){
        return $data[$key];
    }

    return false;
}
```

Then only other meta function we currently need is `meta_tags` (but you might have other meta information, like categories, etc.). To begin with, we pipe everything through `meta_default` and return `false` if we get a `false` back. Otherwise we `explode` the tags at the comma `,` and `trim` every entry using `array_map`. Now we return the array from wrapped in `array_filter`. With all this we ensure we get an array with no empty items, and all tags without leading and trailing spaces.

```php
/**
 *	prepare tags
 */
private function meta_tags($data, $key){
    if( $item = $this->meta_default($data, $key)) {
        $tags = array_map('trim', explode(',',$item));
        return array_filter($tags);
    }

    return false;
}
```
