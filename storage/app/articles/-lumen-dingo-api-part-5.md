---
title: Building APIs with dingo & lumen\:  - PART 5
tags: tag1, tag2
author: Lukas Oppermann
description: Learn how to build a php API with dingo & lumen:
---
# Building APIs with dingo & lumen:
{$meta}

You can build nice json api responses with your transformers, but I find it pays to do as little as possible, so we will let dingo and fractal to all the heavy lifting and significantly reduce the amount if code we would have to write otherwise by using the correct serializer for our needs. But first, lets dive into how we structure out database.

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
