---
title: Building APIs with dingo & lumen\:  - PART 5
tags: tag1, tag2
author: Lukas Oppermann
description: Learn how to build a php API with dingo & lumen:
---
# Building APIs with dingo & lumen:
{$meta}

You can build nice json api responses with your transformers, but I find it pays to do as little as possible, so we will let dingo and fractal to all the heavy lifting and significantly reduce the amount if code we would have to write otherwise by using the correct serializer for our needs. But first, lets dive into how we structure out database.

## Fractal Transformer & Serializer

```php
// set up default serializer
$app['Dingo\Api\Transformer\Factory']->setAdapter(function ($app) {
    $fractal = new League\Fractal\Manager;
    $serializer = new \League\Fractal\Serializer\JsonApiSerializer($_ENV['API_DOMAIN']);
    $fractal->setSerializer($serializer);

    return new Dingo\Api\Transformer\Adapter\Fractal($fractal, 'include', ',', true);
});
```

## Errors

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

## Pagination

When requesting a resource you probably do not want the user to be able to get all item at once. This would firstly lead to potential long download times and also be a stability issue for your system when thousands of items are requested at once. So we use a pagination system, so that per request only a certain amount of items are returned. The json response will have a link to get to the previous and next set of items via an additional request.

The logic for the pagination should be place within the controller. Let's look at a `PostController.php` and see how we can implement a pagination for the posts that are returned when we just hit the `index` method.

```php
use App\Api\V1\Transformers\PostTransformer;

class PostsController extends ApiController {

    private $perPage = 20;

    public function index(){
        // get the posts model
        $posts = new Posts:paginate($this->perPage);
        // return collection with paginator
        return $this->response->paginator($posts, new CollectionTransformer, ['key' => 'posts']);
    }

}
```

Pretty simple, huh. We have `$this->perPage` to define the number of items we want to show per page. It might make sense to move this to the base `ApiController.php`.  We retrieve the *posts* using the `Post` model with the *laravel/lumen* [paginator](https://laravel.com/docs/master/pagination), the first argument is the number of items we want per page.

To return our paginated result we just need to use `$this->response->paginator` instead of `collection`. In contrast to `collection`, its first argument has to be a `LengthAwarePaginator` object. Luckily this is what we have. Additionally we need to add the transformer and key, just like before.

### Pagination for relationships

But what if we want to add pagination to the *posts* that belong to a *collection*? To get those *posts* we *get* the url `htt://your.api/collections/uuid-of-collection/posts`. This path should return all posts, that are in the given collection. If you do not have this route yet, add the following to your `routes.php` within the api group.

```php
$api->get('collections/{collection_id}/pages', 'CollectionsController@getPages');
```

So this route requests the `getPages` method from the `CollectionsController`. Let's add it.

```php
namespace App\Api\V1\Controllers;

use App\Api\V1\Models\Collection;
use App\Api\V1\Transformers\CollectionTransformer;
use App\Api\V1\Transformers\PostTransformer;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;

class CollectionsController extends ApiController {

    public function getPages($collection_id){
        // get the collection with the current id
        $collection = Collection::find($collection_id);
    }
// get current requested page or 1
$page = $request->input('page', 1);
// set items per page, you could use a private variable from the ApiController here
$perPage = 20;
// calc offset for current page
$offset = ($page * $perPage) - $perPage;

// return the collection of posts with paginator
return $this->response->paginator(
    new LengthAwarePaginator(
        $collection->slice($offset, $perPage),
        $collection->count(),
        $perPage,
        $page,
        [
            'path' => $request->url(),
            'query' => $request->query()
        ]
    ),
    // add transformer and key as always
    new PageTransformer,
    [
        'key' => 'pages'
    ]
);

}
```
