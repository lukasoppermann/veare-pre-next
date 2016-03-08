---
title: Building APIs with dingo & lumen\: json api response formats  - PART 5
tags: tag1, tag2
author: Lukas Oppermann
description: Learn how to build a php API with dingo & lumen: json api response formats
next: lumen-dingo-api-part-6
previous: lumen-dingo-api-part-4
---
# Building APIs with dingo & lumen: Json Api Response Formats & Pagination
{$meta}

We are building a [json api](http://jsonapi.org/format/) conform api, which means we need to somehow get our database data into the json api format. You could do it by hand within your transformers, but I find it pays to do as little work as possible, so we will let fractal do all the heavy lifting. This significantly reduce the amount of code we have to write and maintain. The more of your code that is maintained by an active open source community, the more time you have for your business specific code, which nobody will write for you.

## Fractal Transformer & Serializer

`Dingo/api` ships with fractal and fractal has a serializer system. Serializers automatically convert your data into a specific format, like json api. The included serializers let you convert your data into a json api format, an array or a `data` namespaced array. And if you need something special you can write a [custom serializer](http://fractal.thephpleague.com/serializers/#custom-serializers). For our example we will be using the `JsonApiSerializer`, since it is exactly what we want.

To change the default serializer you need to add this bit of code to your `bootstrap/app.php` below the `Register Service Providers`. We basically call up the transformer factory, which is the basis of all transformers you create. It has a `setAdapter` which we use. An adapter is basically a package that provides the transformation logic.

```php
// set up default serializer
$app['Dingo\Api\Transformer\Factory']->setAdapter(function ($app) {
    // our code will be here
});
```

We need to create a new fractal manager and a new `JsonApiSerializer` with the api domain as an argument. This automatically triggers the addition of relationship links to our api responses. Afterwards we use the `setSerializer` method of the fractal manager to tell it to use our new serializer.

```php
$fractal = new League\Fractal\Manager;
$serializer = new \App\Api\V1\Serializer\JsonApiSerializer($_ENV['API_DOMAIN']);
$fractal->setSerializer($serializer);
```

Finally we need to `return` a new fractal adapter instance, which gets the fractal manager as the first argument. The other arguments are the string that is used for includes in the url, the delimiter of the includes in the url and a boolean to set [eager loading](http://fractal.thephpleague.com/transformers/#eager-loading-vs-lazy-loading) to true or false. The entire code looks like this:

```php
// set up default serializer
$app['Dingo\Api\Transformer\Factory']->setAdapter(function ($app) {
    $fractal = new League\Fractal\Manager;
    $serializer = new \App\Api\V1\Serializer\JsonApiSerializer($_ENV['API_DOMAIN']);
    $fractal->setSerializer($serializer);
    // return a new Fractal instance
    return new Dingo\Api\Transformer\Adapter\Fractal($fractal, 'include', ',', true);
});
```

Done, now whenever you return something you should get a perfectly valid json api response. But wait, what about errors? Well...

## Custom error formats with dingo api

For errors we need to do something similar. Underneath the our new serializer setup in the `bootstrap/app.php` we need to call the `setErrorFormat` method on the `Dingo\Api\Exception\Handler`. The method takes the desired error format as its argument. The strings beginning with a colon (`:`) like `:message` will be replaced with the real content of the error. Now if we throw a `NOT_FOUND` exception, dingo will convert it to a valid json api error response.

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

When requesting a resource you probably do not want the user to get all items at once. This would firstly lead to potential long download times and also be a stability issue for your system when thousands of items are requested at once. So we need pagination system, to control the amount of items returned per request. The json response will have a pagination object with links to get to the previous and next set of items via an additional request.

We will add the pagination logic to the `PostController.php` to return only 20 posts when the `index` method is called.

We add a `private $perPage` variable to define the number of items to return. You could set a global number but you might want to return a different amount for different resources. It might make sense to only return 20 posts, but for comments you maybe want to get 50.

### Pagination using eloquents paginate method

As always eloquent provides us with a dead simple way to paginate items, the [`paginate` method](https://laravel.com/docs/5.2/pagination#paginating-eloquent-results). When you new up a model, like `Post`, you can immediatly call the `paginate` method on it and provide the number of items per page as the only argument.

We got out result paginated, but we are still missing the pagination object in the api response. Luckily `dingo/api` got us covered. Instead of returning a `collection`, we just return a `paginator` using `$this->response->paginator` with the same arguments we used for the collection and the rest happens automatically.

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

### Relationships with pagination

This was pretty easy, but what if we are retrieving the *posts* through a relationship? If we hit `/collections/{uuid-of-collection}/posts` we want the posts paginated just like before. First we need to actually set up the route in `routes.php` within the api group.

```php
$api->get('collections/{collection_id}/posts', 'CollectionsController@getPosts');
```

We are calling the `getPosts` method on the `CollectionsController`, so we need to add it. Also make sure you `use` the `Illuminate\Http\Request;` and `App\Api\V1\Transformers\PostTransformer` at the top of your file. In the method we simply retrieve the `collection` with the current `collection_id` and call the `posts` relationship on it, which we discussed in [part 4: Model Relationships](160103-lumen-dingo-api-part-4). To see if it is working, we will just return a collection response, like we did before. You should get all results when you call this route.

```php
namespace App\Api\V1\Controllers;

use Illuminate\Http\Request;
use App\Api\V1\Transformers\PostTransformer;
// other use statements ...
class CollectionsController extends ApiController {

    // some code ...

    public function getPosts(Request $request, $collection_id){
        // get the collection with the current id
        $collection = Collection::find($collection_id);

        // throw 404 exception if resource does not exists
        // this will be converted to a jsonapi error by dingo
        if ($collection === null) {
            throw new \Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
        }

        $this->response->collection($collection->posts(), new PostTransformer ,['key' => 'posts']);
    }
}
```

So we are half the way there, but now we need to add the actual pagination. Sadly, as we are working with a collection and not a model, the `paginate` can not be used. So we need to do the pagination ourselves by using Laravels `LengthAwarePaginator`. To start with add `use Illuminate\Pagination\LengthAwarePaginator` to the list of your imports. The `LengthAwarePaginator` will need the current page as well as the amount of items as an argument. Additionally we need to provide the set of items to display for which we will need the offset. An offset is easily calculated by multiplying the current page with the amount of items per page and substracting the items per page once, because we want to get the offset to the first item on the current page.

```php

    public function getPosts(Request $request, $collection_id){

        // get the collection with the current id
        $collection = Collection::find($collection_id);

        // get current requested page or 1 for pagination
        $page = $request->input('page', 1);

        // calc offset for current page
        $offset = ($page * $this->perPage) - $this->perPage;

        // return the collection of posts with paginator
        return $this->response->paginator(
            new LengthAwarePaginator(...)
        );
    }
```
#### Using a length aware paginator
Once you understand the `LengthAwarePaginator` paginator it is quite easy, especially in combination with [laravel/lumen `collections`](https://laravel.com/docs/5.2/collections#available-methods).

```php
new LengthAwarePaginator(
    $collection->slice($offset, $perPage), // items
    $collection->count(), // total items
    $this->perPage, // items per page
    $page, // current page
    [
        'path' => $request->url(),
        'query' => $request->query()
    ]
);
```

**Items**: As the first argument you need to provide a `collection` of all items on the current page. This can be easily done using the `slice` method of the `collection`, which needs the `$offset` and the amount of items per page as arguments.

**Total items**: Next we need the sum of all items in the `collection`, which we can easily get using the `count` method.

**Items per page**: The amount if items per page has been defined before in our private `$perPage` variable.

**Current page**: We already retrieved and stored the current page in the `$page` variable.

**Options**: The last argument is an array with the `path` and `query`, both of which are also part of the `$request` object and can be retrieved via `$request->url()` and `$request->query()`.

That's it. Posting a `GET` request to `collections/{collection_id}/posts` will return a paginated list of posts with links the api consumer can use to navigate to the next an previous page.

In the next post we will be finally getting real with testing so we can refactor our code while making sure we do not break anything.
