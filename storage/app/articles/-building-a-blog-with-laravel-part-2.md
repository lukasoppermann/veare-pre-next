---
title: Building a blog with Laravel\: descriptions, read time estimations and more - PART 2
tags: tag1, tag2
author: Lukas Oppermann
description: Learn how to add a read time estimation, author, meta description and other features to your very own blogging system
---

## Reading time estimation

Before we can dive into it, we should get a basic understanding of how the reading time works.

### Implementing a reading time estimation
Of course, you can write your own implementation, it is pretty easy and should not take to long, but I prefer to use packages that already exist, if there are any. At the time of writing, there is only one composer package available: [worddrop/bookworm](https://github.com/worddrop/bookworm) it is pretty basic at the moment and only supports a general reading time for text, images are ignored. Maybe this will change in the future, but its good enough for now. Before we can use it, we need to install it from the terminal via *composer*.

```bash
$ composer require worddrop/bookworm
```

Within the `show` method we need to take the content and pass it to the `Bookworm::estimate` function to get our calculation. Personally I added it just below were the content is converted to html for now. Also the second parameter is set to false, this will give us the minutes as an integer without appending any string to it. We need this to display the reading time correctly within a `<time>` element.

```php
// convert markdown to html
$post = $converter->convertToHtml($article);

// reading time estimate as int
$readingTime = Bookworm::estimate($post, false);
```

Just as you can provide a date within an HTML `<time>` element, you can also provide a period. There are two formats to provide a period, the easier one is just the number of minutes followed by an `m`.

I will add it to the meta element, you could if course add it to the template as well, if you want it to be above the headline. Once this is added, your get an idea of how long it will take them to read a specific article.

```php
$metainfo = '...</time> • <time datetime="'.$readingTime.'m">'.$readingTime.' min read</time></div>';
```
