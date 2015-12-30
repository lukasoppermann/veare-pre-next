---
title: Building APIs with dingo & lumen\:  - PART 4
tags: tag1, tag2
author: Lukas Oppermann
description: Learn how to build a php API with dingo & lumen:
---
# Building APIs with dingo & lumen:
{$meta}

> Getting your data structure right can be one of the hardest parts of building your api.

While you can transform your database data into any formats using *transformers*, you will still need to figure out how to structure your data when it is sent back via your API. But at the same time you should keep an eye on storing your data in your database as flexible as possible, so that you do not have to change your database when adding more tables later on. While it is not impossible to complete redesign your database when you already have a full system, it is a pain and you should try to avoid it by any means.

You can build nice json api responses with your transformers, but I find it pays to do as little as possible, so we will let dingo and fractal to all the heavy lifting and significantly reduce the amount if code we would have to write otherwise by using the correct serializer for our needs. But first, lets dive into how we structure out database.

## Relationships: Content tables & Pivot tables
Generally APIs will deal with loads of content, often, content that is related is stored in different tables though. An example would be articles are stored in the `articles` table, while the collection the article is a part of, is stored int he `collections` table. This is one of the easiest cases of relationships, a simple *one to many* relationship, where an article can only be in **a single** collection, but **one** collection  can own **many** articles.

Using lumen, all you need to do for this relationship to work, is add a `collection_id` column on your `articles` table and the following to your `collection` model.

```php
namespace App\Api\V1\Models;

use Illuminate\Database\Eloquent\Model;

class Collection extends Model
{
    /**
     * Get the pages for the collection.
     */
    public function pages()
    {
        return $this->hasMany('App\Api\V1\Models\Page');
    }
}
```


## Timestamps & soft deletes

## Faker

## Fractal

```php
// set up default serializer
$app['Dingo\Api\Transformer\Factory']->setAdapter(function ($app) {
    $fractal = new League\Fractal\Manager;
    $serializer = new \League\Fractal\Serializer\JsonApiSerializer($_ENV['API_DOMAIN']);
    $fractal->setSerializer($serializer);

    return new Dingo\Api\Transformer\Adapter\Fractal($fractal, 'include', ',', true);
});
```

## errors

Add the following to your `bootstrap/app.php` file
```php
// set up error format
$app['Dingo\Api\Exception\Handler']->setErrorFormat([
    'error' => [
        'message' => ':message',
        'errors' => ':errors',
        'code' => ':code',
        'status_code' => ':status_code',
        'debug' => ':debug'
    ]
]);
```
