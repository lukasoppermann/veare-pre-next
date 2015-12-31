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

## What is a model relationships?
A relationship defines a connection between models, for example a comment that has been created by a user. The benefit of relationships is that you can get all the information about the user who posted the current comment without storing the details of the user on the comment. This can be helpful in maintaining your system, for example if the usernames are displayed below their comments and the user changes his name, you would need to update the user name on the comment model as well, but if you use relationships the correct name will be retrieved, because the user and the comment are only linked by a never changing `id`. Depending on your needs there are different types of relationships, the most common will be discussed below.

**NOTE:** Relationships are not a concept unique to *laravel/lumen* and work similar in other systems. However the specific way of implementing the relationship using eloquent will not work for other systems.

### One to one relationships
The easiest relationship is a the one to one relationship, for example when **one** user has **one** profile picture (avatar).

Relationships are defined on the model, for a one to one relationship the *owning* model, `User`, needs a function *avatar* that tells eloquent which model it owns (has). Once this is defined the related record can be access using a *dynamic property*, `avatar`: `User::find(1)->avatar`.

```php
<?

namespace App\Api\V1\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * Get the avatar associated with the user.
     */
    public function avatar()
    {
        return $this->hasOne('App\Api\V1\Models\Avatar');
    }
}
```

The first part is done, but how is eloquent supposed to know which of the many avatars actually belongs to a specific user? We need a *foreign key* on the *owned* models table. By default it is assumed that the avatars table has a column named `user_id` which matches the `id` on the owning user model. it is possible to change those expectations, by providing a second argument on the `hasOne` method, to change the name if the column on the related model (hasOne is on the `User` model, so the related model is `Avatar`). An additional third argument can be used to change the *local key*, if you want the user to be matched by a field other than `id`.

```php
public function avatar()
{
    // now the avatars profile_id column needs to match the users profile_id column
    return $this->hasOne('App\Api\V1\Models\Avatar', 'profile_id', 'profile_id');
}
```

I strongly recommend against changing the defaults for this if you have any way to get around it. Changing defaults makes it harder for you or another developer to work with your code later on, because the whole code needs to be read to understand how it works. Often, not using defaults also leads to more code, that needs to be written and maintained.

#### Inverse relationship
Sometimes it makes sense to define the inverse relationship. For our example it would mean you would get the user that is connected to the current `avatar`. For this to work you need to add the `user` method to your `Avatar` model. Note the use of `belongsTo` instead of `hasOne`. This is needed so eloquent which model owns which, and thus which table to find the *foreign key* on.

```php
<?

namespace App\Api\V1\Models;

use Illuminate\Database\Eloquent\Model;

class Avatar extends Model
{
    /**
     * Get the user associated with the avatar.
     */
    public function user()
    {
        return $this->belongsTo('App\Api\V1\Models\User');
    }
}
```

### One to many relationships
The next level is a relationship where for e.g. **one** `Collection` model owns **many** articles. Articles stored in the `articles` table can only be part of **one** collection. However, the **one** collection, stored in the `collections` table, can own **many** articles.

This relationship is very similar to a one to one relationship, which the one difference, that the dynamic property returns an eloquent collection of records, where previously we returned only an individual record, this will be important when working with the related data.

To set up our relationship we need to add a foreign key to the *owned* models table, articles, which by default should be named `collection_id`. Now we only need to add an `articles` method with a `hasMany` call to the *owning* `Collection` model. For the inverse relationship we add a `collection` method with a `belongsTo` call to the *owned* `Article` model. If you want to change the foreign or local key, refer to the `hasOne` method from the *One to one relationships* section, its exactly the same.

```php
// Collection Model
<?php

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

// Article Model
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

When accessing the related articles you get an eloquent collection, so you need to loop through the result to access individual items. Of course, since the returned collection is a `query builder` instance, you can also use the [query builder syntax](https://laravel.com/docs/5.2/queries) to retrieve a specific record. Since the inverse relationship is a *to one* relationship, because an article is only in **one** collection, accessing this collection is exactly the same as with the *one to one* relationship.


```php
// looping through collection
$articles = App\Api\V1\Models\Collection::find(1)->articles;

foreach ($articles as $articles) {
    echo $articles->title;
}

// retrieve specific items using query builder syntax
$articles = App\Api\V1\Models\Collection::find(1)->articles->where('title', 'First article')->first();

// inverse relationship is the same as with one to one relationship
echo App\Api\V1\Models\Article::find(1)->collection->type;
```

### Polymorphic relationships
This is all nice, but what if you want to have articles not only associated with collections, but also with topics? E.g. an article is in the collection *learning php* but also in the topic *programing*, while another article could be in the collection *traveling* and the topic *minimalism*. For this you need polymorphic relationships. Don't worry, it sounds more intimidating than it actually is. The solution that is polymorphic relationships is similar to a one to many relationship with an additional column stating the type of the related model (model name). So in your article table instead of the `collection_id` we need an `articleable_id` and an `articleable_type`. It sounds a little weird, but the convention is to use the model name and add an *able* to the end, thus showing its polymorphic.

The owned model needs an `articleable` method which just calls `morphTo`.

```php
<?php

namespace App\Api\V1\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    /**
     * Get all of the owning articleable models.
     */
    public function articleable()
    {
        return $this->morphTo();
    }
}
```

Both owning models need a method `articles` which calls the `morphMany` method with the fully namespaced article as the first argument and the identifier `articleable` as the second argument.

```php
<?php

namespace App\Api\V1\Models;

use Illuminate\Database\Eloquent\Model;

class Collection extends Model
{
    /**
     * Get all of the collection's articles.
     */
    public function articles()
    {
        return $this->morphMany('App\Api\V1\Models\Article', 'articleable');
    }
}

class Topic extends Model
{
    /**
     * Get all of the topic's articles.
     */
     public function articles()
     {
         return $this->morphMany('App\Api\V1\Models\Article', 'articleable');
     }
}
```

To retrieve the articles related to a topic or collection, simply access the *dynamic property* `articles` just like on the *owning* model in a one to many relationship. If you have an article, you can get the *owning* relationship by accessing the *dynamic property* `articleable`. This will return a single collection or topic just like when retrieving the the *owner* in a one to many relationship.

### Many to many relationships
When you want to connect **many** tags to **many** articles, you need a different setup. You can not put the article id on the tag, as you could have multiple tags per article, and multiple articles that have the same tag associated with them. You will need add/delete those tags and handling this all in one text field would be a nightmare. The solution: a `pivot` table, an additional `article_tag` table, that has 3 columns `id`, `article_id`, `tag_id` to connect the two models. For each relation a new entry will be added to this table, with the `article_id` field having an id from the `articles` table and the `tag_id` having an id from the `tags` table. Deleting a relationship is as easy as deleting a row. The `id` is a simple *int* as it will not be exposed via an API, thus not needing to be a *uuid*.

By default, eloquent assumes the name of the pivot table to be a the names of the two models in alphabetical order, combine with an underscore *_*. While you could overwrite this behavior in the `belongsToMany` method we will be using in a bit, I highly discourage this as well, as it just means more code to maintain and more possibilities for errors. Be a chum, stick to defaults where you can.

Once the `pivot` table is created, you can start defining the relationship on your models, many to many relationships are not really directional, so they are defined exactly the same for both models, just with the opposite model referenced. The `belongsToMany` method that is used, has actually three additional arguments, the first one for the `pivot` table name, the second for the *foreign key* and the third for the *local key*. If you don't add any addition arguments here, the ids are assumed like before, *modelname*_id.

```php
// Article Model

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

// Tag Model

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

To get a related model simply use the *dynamic properties* like before. For both models an eloquent collection is returned, so you can either loop through the collection using a `foreach` loop or drill down with the query builder syntax.

There is more you can do with pivot tables, like storing `created_at` and `updated_at` timestamps on them. If this is something you need, read the [retrieving intermediate table columns section](https://laravel.com/docs/5.2/eloquent-relationships#many-to-many) in the docs.

### Many to many polymorphic relationships
Now let's get even more crazy, imagine you have articles and videos which both are tagged using tags that are stored in the tags table. A many to many relationship would not work, because eloquent does not know which of the two is the owning model for a particular entry. So we use the same idea we used for polymorphic relationships and combine it with the pivot table from many to many relationships. In short we need a pivot table, which records the `tag_id` as well as the owning models id and the owning models type.

First create the pivot table, named `taggables` by default eloquent expects the pivot table to be named like the second argument in the `morphToMany` call (ours will be `taggable`) with and additional `s` in the end. The pivot table needs three columns `tag_id`, `taggable_id` and `taggable_type`. Eloquent will automatically fill this table, and an entry will be something like ` 1 | fc9234-... | Video `, where `1` is the id of the tag, `fc92334-...` is the `uuid` of the video and `Video` is the name of the model.

On our `Video` and `Article` model we define the exact same relationship to the `Tag` model.

```php
<?php

namespace App\Api\V1\Models;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    /**
     * Get all of the tags for the video.
     */
    public function tags()
    {
        return $this->morphToMany('App\Api\V1\Models\Tag', 'taggable');
    }
}
```

Since the `Tag` model is related to two other models, we need to define two inverse relationships.

```php
<?php

namespace App\Api\V1\Models;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    /**
     * Get all of the videos that are assigned this tag.
     */
    public function videos()
    {
        return $this->morphedByMany('App\Api\V1\Models\Video', 'taggable');
    }

    /**
     * Get all of the articles that are assigned this tag.
     */
    public function articles()
    {
        return $this->morphedByMany('App\Api\V1\Models\Article', 'taggable');
    }
}
```

Retrieving related models works just like with any other many to many relationship.
For both *owning* models (`Video` and `Article`) defined by the `morphToMany` call an eloquent collection is returned when using the *dynmaic property* `tags`. You can either loop through the collection using a `foreach` loop or drill down with the query builder syntax. If you want to get the *owning* models from an *owned* `Tag` model you can either use the *dynmaic property* `articles` or `videos`, depending on the content you are looking for. In both cases a collection will be returned, just like before.

## Faker
