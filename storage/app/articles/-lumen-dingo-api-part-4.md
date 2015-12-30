---
title: Building APIs with dingo & lumen\: Model Relationships - PART 4
tags: tag1, tag2
author: Lukas Oppermann
description: Learn how to build a php API with dingo & lumen: Model Relationships
---
# Building APIs with dingo & lumen: Model Relationships
{$meta}

> Getting your data structure right can be one of the hardest parts of building your api.

When returning data from your database via your API you can transform your data into any format using your *transformers*. However, keeping a clean and flexible database structure is still important, as it will make it much easier to expand your system later on and reduce the amount of data you send down the wire. For example, when requesting a collection, the user does not need all articles from this collection to be requested, but only needs a way of getting the articles. The best way to keep you data this flexible are relationships, meaning you store your data in different tables, but define the way they are related, so your ORM (eloquent) can retrieve the items individually or including the related items, depending on your needs.



## Relationships: Content tables & Pivot tables
Generally APIs will deal with loads of content, often, content that is related is stored in different tables though. In the following I will discuss the different relationship models. You will most likely not need all of them for your API, so this part is not a "build along" part but rather a general information section.

### One to one relationships

### One to many relationships
An example would be articles are stored in the `articles` table, while the collection the article is a part of, is stored in the `collections` table. This is one of the easiest cases of relationships, a simple *one to many* relationship, where an article can only be in **a single** collection, but **one** collection  can own **many** articles.

Using lumen, all you need to do for this relationship to work, is add a `collection_id` column on your `articles` table and the following to your `Collection` model.

```php
<?

namespace App\Api\V1\Models;

use Illuminate\Database\Eloquent\Model;
use App;

class Collection extends Model
{
    /**
     * Get the articles for the collection.
     */
    public function articles()
    {
        return $this->hasMany('App\Api\V1\Models\Article');
    }
}
```

Now you can access the articles from the current collection using a *dynamic property* that lumen prepares for you.

```php
$articles = App\Api\V1\Models\Collection::find(1)->articles;

foreach ($articles as $article) {
    // access individual article
}
```

However, it is often convenient to have the inverse relationship defined as well, so you can easily get the collection, the current article belongs to. To do so, you would need to define the following relationship on the `Article` model.

```php
<?php

namespace App\Api\V1\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    /**
     * Get the collection that owns the article.
     */
    public function collection()
    {
        return $this->belongsTo('App\Api\V1\Models\Collection');
    }
}
```

You can now access the collection like so:

```php
$article = App\Api\V1\Models\Article::find(1);

echo $article->collection->type;
```

### Many to many relationships
When you want to connect **many** tags to **many** articles, you need a different setup, because now you can not put the tag id on the article, as you could have multiple tags per article. Enter the `pivot` table. A `pivot` table is a simple additional table `article_tag`, that has only 3 columns: `id`, `article_id`, `tag_id`. The name of this table is automatically guessed by lumen, by combining the two model names in alphabetical order. While you could overwrite this behavior, I highly discourage it, as this just means more code to maintain and more possibilities for errors. You can use a normal *int* as an id here, the pivot items will never be exposed through the API, so there is no need for a *uuid*. Defining the relationship is as easy as before, just add the following to your `Article` model.

```php
class Article extends Model
{
    ...
    /**
     * Get the tags that this article belongs to.
     */
    public function tags()
    {
        return $this->belongsToMany('App\Api\V1\Models\Tag');
    }
}
```

Defining the inverse relationship is exactly the same, but on the `Tag` model. Once this is done you can access the relationships just like before, using the *dynamic property* of `tags` or `articles`, depending on the model you are querying from.

```php
class Tag extends Model
{
    ...
    /**
     * Get the articles that this tag belongs to.
     */
    public function articles()
    {
        return $this->belongsToMany('App\Api\V1\Models\Article');
    }
}
```

### Polymorphic relations
An even more complicated relationship is when for example articles and photos both can have the same tags. This means a tag can be related to many items, but they can be either a photo, or an article. To


### Many To Many Polymorphic relations

## Faker
