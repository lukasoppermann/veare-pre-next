---
title: Building APIs with dingo & lumen\: Transformers, Unit testing & JSON API - PART 3
tags: tag1, tag2
author: Lukas Oppermann
description: Learn how to build a php API with dingo & lumen: transformers, unit testing & JSON API.
---
# Building APIs with dingo & lumen: Transformers, Unit testing & JSON API
{$meta}

> In [Part 2 of building APIs with dingo & lumen](151119-lumen-dingo-api-part-2) we added all the database stuff but our transformer is just passing on the data from the DB. Well, that is stupid, so lets fix it.

## Tests first

Before we implement the code in our transformer, we will update our test so we know when we achieved our goal. In the `CollectionTest.php` file we need to replace `$this->markTestIncomplete('add expected return data.');` with our expectation for the returned data. However we are randomly creating data using faker, so we can not validate a specific item, because we do not know the values a given item will have. All we want to specify is the type, so we need to do something like this:

```php
$expected = [
    'id' => 'string',
    'type' => 'in:travel,news',
    'attributes' => [
        'page_id' => 'string',
        'position' => 'integer',
    ]
];

$this->assertValidArray($expected, $this->getResponseArray($response)['data'][0]);
```

Awesome, right? There is only one problem with this: it does not work. Neither Laravel nor PHPUnit comes with an `assertValidArray` function. Luckily this problem can be easily solved by extending the Laravel `TestCase`.

### Writing the TestTrait class
We will collect our additions to the `TestCase` in a trait, which we can import into our `TestCase` class. The benefit of this is, that we have no trouble when updating Laravel or using a fresh installation. Just copy over the trait and add the `use` statement to the `TestCase` class.

Create and open `tests/TestTrait.php`, in here we need to `use` the *illuminate validator*, as it will provide the functionality of checking value types. We will use a `private $errors` array to store our errors. This is necessary so we can return multiple errors at once. The `assertValidArray` method takes our *validation rules* as well as our data and runs it through our soon to be coded `validateArray` method. Afterwards it lets the assertion fail, if we have one or more errors.

```php
<?php

namespace Lukasoppermann\Testing;

use PHPUnit_Framework_Assert as Assertion;
use Illuminate\Support\Facades\Validator;

trait TestTrait
{
    /*
     * Validation errors
     */
    private $errors = [];
    /*
     * Validate an array against predefined rules.
     */
    protected function assertValidArray(array $rules, array $resourceData)
    {
        // validate rules
        $this->validateArray($rules, $resourceData);
        // log errors to console
        if (count($this->errors) >= 1) {
            Assertion::fail(implode(PHP_EOL, $this->errors));
        }
    }
}
```

Good, so now we have the first part sorted out we need to add the `validateArray` method. It is a little bit complex, we need to loop through all rules and if they are strings, we add them to the rule array and add a `required`, because all feeds need to be required for unit test. However, if the rule is an array, like `attributes`, we add it with just a `required` rule and run the `validateArray` on its child array again. After all is done we run the validator, which will either pass returning an empty array, or return an array of error messages. We into the `$this->errors` array adding a little command line coloring.

```php
/*
 * Get validation rules and run validator
 */
protected function validateArray($rules, $resourceData)
{
    // set all rules to required
    foreach ($rules as $key => $rule) {
        // if the attribute has no children, validate it
        if (!is_array($rule)) {
            $rules[$key] = $rule.'|required';
        // if the attribute has children, do a sub-loop
        } else {
            $rules[$key] = 'required';
            if (array_key_exists($key, $resourceData)) {
                $this->validateArray($rule, $resourceData[$key]);
            }
        }

    }
    // run validator
    $validator = Validator::make($resourceData, $rules);
    // store errors
    foreach ($validator->messages()->toArray() as $error) {
        $this->errors[] =  "\e[1;31m× \033[0m".$error[0];
    }
}
```

If you run your unit test now by typing `phpunit` into the terminal, you should get an error `× The attributes field is required.` This calls for our transformer, so lets build it.

## Transformers

A transformer changes (transforms) a value or group of values into a specified structure and type. This has a couple of advantages in contrast to using the values straight from the source e.g. Database:

- only specified values are displayed, secret fields (maybe added later on) can not *spill* into the returned dataset.
- adds a layer of abstraction between the database and your code. Changes on your database or code have no influence on the other part.
- cast values to specific types, e.g. bool or int
- nest data and bring it into a specific format, like the *json api* format

We want to return the collection in a json api standard format. The json api dictates that a [*resource object*](http://jsonapi.org/format/#document-resource-objects), must have an `id` and `type` field. An resource object represent resources, a resources is an endpoints of your api, like *collections*, or *posts*. A resource object may have an `attributes` field, representing additional data of the resource. We will use this for all additional data, as the collection table is basically a pivot table and `relationships` don't really make sense here.

So open the `CollectionTransformer.php` and replace the `return $collection;` statement with the code below. Your unit tests should now pass.

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

## Jsonapi standard
We got the transformer working for us, but the result of our api is rubbish, so we need to rethink what endpoints we actually need, we will do so in the next part. However lets take a moment to discuss the [json api standard](http://jsonapi.org/).

> JSON API is a specification for how a client should request that resources be fetched or modified, and how a server should respond to those requests.

The benefit of using a standard is, that other [developers will know it](http://jsonapi.org/implementations/#client-libraries-php) and have an idea of how to work with it and what to expect. Also, since the standard is build on experience it can provide good answers to some questions, like how should I structure XYZ. I found that one tends to either overthink stuff or do it the first way one can think of. This can lead to an inconsistent API, which is definitely not what you want. When designing api responses you can run into many problems that you can't even imagine now. The json api standard provides a good solution to many of those problems, like linking resources, etc. because the people who developed it dealt with those problems before.

While I recommend reading the entire documentation, its not so long, after all, I will discuss the important objects here.

### Top Level
This object MUST be returned for every request. It has at least a `data`, `errors` or `meta` member, but it can not have both a `data` and an `errors` member. Either you get the data, or you get an error.
Within the `data` member a `resource` object or a collection of `resource` objects is returned.

### Resource Object
A "resource object" represents a single resource, our data, (e.g. a hiking route) and must at least have an `id` and `type` (no `id` is required if the object is send from the client and represents a new object, as it does not have an id yet). Resource objects can also contain the following fields:
- **attributes:** representing the resource's data (e.g. starting position of a route)
- **relationships:** representing relationships between the resource and other resources (e.g. the creator of a route)
- **links:** links related to the resource (e.g. the creators profile)
- **meta:** non-standard meta-information about a resource that can not be represented as an attribute or relationship.

```javascript
{
  "data": {
    "type": "articles",
    "id": "1",
    "attributes": {
      // ... this article's attributes
    },
    "relationships": {
      // ... this article's relationships
    }
  }
}
```

### Resource Identifier Objects
A "resource identifier object" represents a single resource (e.g. a hiking route), but does not include the full set of information for this resource. It must contain an `id`and `type`. It can also include a `meta` object for additional information. This is useful when you do not want to return complete objects, but just a list of items so that an individual item can be chosen from the returned indentifiers and retrieved in full. This can save a huge amount of data to transfer, for example when retrieving gpx tracks, which can be very big.

```javascript
{
  "data": {
    "id": "5",
    "type": "route"
  }
}
```

### Meta Information
A meta object is used to include any non-standard meta information, like *authors* or *position*.

```javascript
{
  "meta": {
    "position": 1,
  },
  "data": {
    // ...
  }
}
```

### Links
A link object is used to add links to a set of data, for example a link to itself. A use case could be when you get a set of `resource identifier` objects and want to retrieve an individual `resource` object, like an actual post.

A link object can either be a URL as *string* or an object containing a URL as *string* as well as some *meta* information

```javascript
"links": {
  "self": "http://example.com/posts",
}

// or

"links": {
  "related": {
    "href": "http://example.com/articles/1/comments",
    "meta": {
      "count": "22"
    }
  }
}
```

### JSON API Object
This object may include the version number of the highest supported json api version and a meta object. As changes to the json api standard are only additive, this will not be important for most apis, but it also does not hurt to include it. It is also defined that, if the version number is not present, clients should assume the server implements at least version 1.0 of the specification.

```javascript
{
  "jsonapi": {
    "version": "1.0"
  }
}
```

This should give you a brief overview of some of the important parts of the json api standard. However many parts were not covered, like error objects or content negotiation, so you might want to read the entire specification for yourself before continuing.
