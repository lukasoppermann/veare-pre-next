---
title: Building APIs with dingo & lumen\: Transformers & Unit testing - PART 3
tags: tag1, tag2
author: Lukas Oppermann
description: Learn how to build a php API with dingo & lumen: transformers & unit testing.
---
# Building APIs with dingo & lumen: Transformers & Unit testing
{$meta}

> In [Part 2 of building APIs with dingo & lumen](151119-lumen-dingo-api-part-2) we added all the database stuff but our transformer is just passing on the data from the DB, well that is stupid, so lets fix it.

## Transformers

A transformer changes (transforms) a value or group of values into a specified structure and type. This has a couple of advantages in contrast to using the values straight from the source e.g. Database:

- only specified values are displayed, secret fields (maybe added later on) can not *spill* into the returned dataset.
- adds a layer of abstraction between the database and your code. Changes on your database or code have no influence on the other part.
- cast values to specific types, e.g. bool or int
- nest data and bring it into a specific format, like the *json api* format

Before we implement the code in our transformer, we will update our test so we know when we achieved our goal. In the `CollectionTest.php` file we need to replace `$this->markTestIncomplete('add expected return data.');` with out expectation for the returned data.



So open the `CollectionTransformer` and replace the `return $collection;` statement with the code below. This will return the collection in a json api format. Later on, if you decide to e.g. rename `page_id` to `post_id`, you can easily update your transformer to achieve this change.

```php
return [
    'id' => $collection->id,
    'type' => $collection->type,
    'attributes' => [
        'page_id' => $collection->page_id,
        'position' => (int) $collection->position,
    ]
];
```
