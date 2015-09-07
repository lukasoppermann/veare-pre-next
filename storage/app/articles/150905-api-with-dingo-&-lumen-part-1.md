---
title: API with dingo & lumen - PART 1
tags: tag1, tag2
---
# API with dingo & lumen - PART 1

In this series we will write a well tested api using [lumen](http://lumen.laravel.com/) and the [dingo/api](https://github.com/dingo/api) package. We are going to build an api for storing and retrieving posts, which are organized in collections.

## Install lumen & dingo/api

I assume you have composer installed on your machine and a basic knowlege of how to use the command-line.
So lets start installing lumen via the composer `create-project` command.
```
composer create-project laravel/lumen --prefer-dist myLumenApi
```

Now we can `cd` into our project and install dingo/api.
```
cd myLumenApi
composer require dingo/api:1.0.x@dev --prefer-dist
```

We need to do a little configuration before we can start to build our api, so jump over to your IDE and open `bootstrap/app.php`.

In lumen you can store environment variables in a file named `.env`. On your production server you would set up real environment variables, but for development this is much easier. For this to work, simply uncomment line 5 in the `app.php` file.

```
Dotenv::load(__DIR__.'/../');
```

Lumen ships with eloquent, the excellemt ORM you know from laravel. Some people might argue that you need to implement a repository pattern to be able to easily switch out your ORM without having to edit all your controllers, but I would say that in most cases this is premature optimization. You can still implement a repository pattern the first time you actually switch out your database access layer.

Anyway, eloquent will not be loaded by default, so we need to uncomment line 24 in the `app.php` file to use it.
```
$app->withEloquent();
```

To get the `dingo/api` packges loaded all we need to do is register the `LumenServiceProvider` in the `app.php` file. To do so, add the following  at line 80:

```
$app->register(Dingo\Api\Provider\LumenServiceProvider::class);
```

## Setting up homestead
I expect you to have a working version of homestead on your machine, if not, follow the instructions on the [homestead installation page](http://laravel.com/docs/master/homestead) and setup homestead. Once you are done we need to add a new domain to it, so lets move over to the terminal.

```
homestead edit
```
Now you should have the `Homestead.yaml` file open in your default IDE. Add a new entry under the `sites` section.

```
- map: api.mylumenapi.app
  to: /home/vagrant/Code/mylumenapi/public
```

To finish up we add this domain to our hosts file. Open it with the following command.

```
atom /etc/hosts
```
You can substitude `atom` for any editor you have installed which has a cli implementation, like sublime or textmate. Add the following line to this file and save it.

```
192.168.10.10  api.mylumenapi.app
```


## Configure dingo/api

In your .env file, add the following:


API_STANDARDS_TREE=vnd
API_SUBTYPE=yourVendorName

API_PREFIX=/

API_VERSION=v1

API_NAME=YourApiName API

API_STRICT=false

API_DEBUG=true


## Setup for your tests

I am going to use a somewhat TDD style to build this, so I start by writing a basic test, but firstly, install the following to get some more readable status codes (Phil Sturgeon wrote about why https://philsturgeon.uk/http/2015/08/16/avoid-hardcoding-http-status-codes/)

> composer require lukasoppermann/http-status --prefer-dist

In your TestCase.php import and implement the interface.

use Lukasoppermann\Httpstatus\Httpstatuscodes;

class TestCase extends Laravel\Lumen\Testing\TestCase implements Httpstatuscodes

Now you can use something like self::HTTP_OK in your tests, which is much easier to understand than some weird numbers.

We also need guzzle, because phpunit does not know how to call the routes, since dingo is using a custom router

composer require guzzlehttp/guzzle:~6.0 --prefer-dist

In your TestCase.php add a setUp function. If you are not familiar with it, its  a default phpunit function, which is called before every unit test. We use it to setup guzzle

class TestCase extends Laravel\Lumen\Testing\TestCase implements Httpstatuscodes
{
    protected $client;

    public function setUp()
    {
        parent::setUp();

        $this->client = new GuzzleHttp\Client([
            'base_uri' => 'http://api.formandsystem.app',
            'exceptions' => false,
        ]);
    }


## Writing your tests

Now we are finally ready to write our very first test. The first thing we will need to be able to do, is to retrieve a comment stream. This happens by calling the endpoint streams/{stream} where {stream} is something like an ID of the stream.

<?php

class StreamsTest extends TestCase
{
    /**
     * @test
     */
    public function get_a_stream_by_id()
    {
        $response = $this->client->get('/streams/1');

        $this->assertEquals(self::HTTP_OK, $response->getStatusCode());

    }
}


## Adding the route ....

## Seeding & Modelfactories in the next post
