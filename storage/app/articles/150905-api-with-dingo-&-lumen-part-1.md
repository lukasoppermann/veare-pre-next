---
title: API with lumen & dingo/api - PART 1
tags: tag1, tag2
author: Lukas Oppermann
---
# API with dingo & lumen - PART 1
{$meta}
In this series we will write a well tested api using [lumen](http://lumen.laravel.com/) and the [dingo/api](https://github.com/dingo/api) package.

## Install lumen & dingo/api

I am assuming you have composer installed on your machine and a basic knowledge of how to use the command line.
So lets start installing lumen via composers `create-project` command. This command creates a new folder with the name of your project, so make sure to `cd` into your `code` directory (or wherever you store all your projects) first. Once the installation is done we can `cd` into the newly created project folder and require the `dingo/api` package using composer.

```bash
cd ~/code
composer create-project laravel/lumen --prefer-dist myLumenApi
cd myLumenApi
composer require dingo/api:1.0.x@dev --prefer-dist
```

Before we can start to build our api we need to do a little configuration, so open `bootstrap/app.php` in your text editor of choice and uncomment line 5. This will make it possible to use an `.env` file, which you can use in your development environment to simulate environment variables. You can read more about `.env` files in the [Lumen docs](http://lumen.laravel.com/docs/installation#environment-configuration).

```php
Dotenv::load(__DIR__.'/../');
```

Now uncomment line 24 to enable [Eloquent](http://laravel.com/docs/5.1/eloquent), Laravels and Lumens excellent ORM. You could instead implement a repository pattern to abstract your database layer, but I would only recommend it if you are at least 50% sure you will need this, or if your api is really huge. Otherwise you just add an overhead you might never need, and if you do need it, its not such a big pain to refactor a couple controllers to use a repository.

```php
$app->withEloquent();
```

Now we only need to load dingos service provider, which I would add at line 80. This pulls in the magic of the `dingo/api` packages for us.

```php
$app->register(Dingo\Api\Provider\LumenServiceProvider::class);
```

## Setting up homestead
I expect you to have a working version of homestead on your machine, if not, follow the instructions on the [homestead installation page](http://laravel.com/docs/master/homestead) and setup homestead. Once you are done we need to add a new domain to it, so open `/etc/hosts` by running `open /etc/hosts` in your command line and add a dev domain to it.

```bash
192.168.10.10  api.mylumenapi.app
```

Afterwards we need to add this to homestead so run `homestead edit` from the command line and add the following entry under the `sites` section.

```bash
sites:
    - map: api.mylumenapi.app
      to: /home/vagrant/Code/mylumenapi/public
```

You might need to destroy your vm and restart it, to get it to pick up the new domain. Do this by running the commands below in your command line. If everything went according to plan, you should be able to see the lumen welcome page when accessing your domain `api.mylumenapi.app`.

```bash
homestead destroy
homestead up
```

## Configure dingo/api
The `dingo/api` package lets you change much of its bahaviour by changing the settings via the environment variables, so open your `.env` file and add the variables described below. The [dingo/api documentation](https://github.com/dingo/api/wiki/Configuration) is actually pretty good if you want to read more about those configurations.

**API_STANDARDS_TREE=vnd**   
If your api is publicly available or at any point will be, use the vendor tree `vnd`. The personal tree `prs`, is meant for not distributed projects only. I recommend to always use the `vnd` tree, since it does not hurt you if your api stays private.

**API_SUBTYPE=yourVendorName**
This is the name of your project or application. Github for e.g. uses `github`. It will be part of the accept header, which will look like `vnd.yourVendorName.v1+json`.

**API_PREFIX=/**
For dingo to work you need to provide either a prefix or a subdomain, but subdomain routing is only supported by laravel, not lumen. Since our app is a standalone api we can use a prefix of `/` which means our base url for the api is our urls (api.mylumenapi.app).

**API_VERSION=v1**
The version option specifies our default version, which is used whenever a request does not specify a version. This should always track your most recent version. Make sure to advise your api user to always specify an api version so they are not suprised by breaking changes that may be introduced with a new version.

**API_NAME=YourApiName API**
This option is used as your api name when generating your api documentation via the `api:docs` command.

**API_STRICT=false**
When strict mode is enabled, requests need to specify an `Accept` header. If none is provided an exception will be thrown, instead of using the specified default version. This means you are not able to view your api via your the browser. You would possibly turn this on, but for developing it is quite handy to quickly view your api in the browser, so we set it to false for now.

**API_DEBUG=true**
Just remember to turn this off in your production app.

There are more options available but we do not need to set them at the moment. If you are interested, head over to the [docs](https://github.com/dingo/api/wiki/Configuration), to read all of them.

## Preparing the test setup with phpunit

Our tests are going to run against the api, so we need to install `guzzle` to make those calls, we use the `--prefer-dist` flag so that we do not get all the tests and things that are only needed for devlopment.

```bash
composer require guzzlehttp/guzzle:~6.0 --prefer-dist
```

Since our tests are also part of our documentation, we will try to be as verbose as we can. Good tests should be easy to understand, so a new developer (or yourself in a couple month) can get an idea of what you api does, by reading the tests and expected results. One part in this is using readable http status codes ([http-status package](https://github.com/lukasoppermann/http-status)) instead of magic numbers. (Phil Sturgeon [wrote more about the why](https://philsturgeon.uk/http/2015/08/16/avoid-hardcoding-http-status-codes/)).

```bash
composer require lukasoppermann/http-status --prefer-dist
```

Everything installed? Perfect, lets dive right in: open your `tests/TestCase.php` to import and implement the interface.

```php
<?php

use Lukasoppermann\Httpstatus\Httpstatuscodes;

class TestCase extends Laravel\Lumen\Testing\TestCase implements Httpstatuscodes{
```

With this interface implementend we can use something like `self::HTTP_OK` in our tests, which is much easier to understand than the numbers. To get guzzle readay we need to add a `setUp` function to our `TestCase.php` file. Make sure you spell it correctly, as it is a special function, which is called by [phpunit](https://phpunit.de/manual/current/en/fixtures.html) before every test.

```php
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
```

With this addition we can now use `$this->client` in our unit test to make guzzle calls.

## Writing your tests

Now we are ready to write our very first test, so lets think about how our app will work. We will have posts which are grouped in collections like a travel collection or a tutorial collection. Our api needs to respond to `/collections/travel` with a list of posts. Create a new file in the `tests` directory named `ColectionTest.php` with this test.

```php
<?php

class CollectionTest extends TestCase
{
    /**
     * @test
     */
    public function get_a_collection_by_name()

        $response = $this->client->get('/collections/travel');

        $this->assertEquals(self::HTTP_OK,
            $response->getStatusCode());

    }
}
```

At the moment our test only checks for a correct status code, but in the next part we will modify it to test for our desired response. Don't forget to either prefix your test functions with `test_` or, like in the example above, add the `@test` doc block, otherwise phpunit will not be able to run your tests.

## Adding the route
If we run our test now, we get an error like this:

```bash
Failed asserting that 400 matches expected 200.
```

This is to be expected, as we did not add any route yet. Adding a route is pretty simple, but in our case, have have to use the `dingo/api` router, instead lumens, default router, to get all the versioning and header stuff. Actually it is pretty straight forward we just need to add the following to our `routes.php`.

```php
$api = app('Dingo\Api\Routing\Router');

$api->version('v1', function($api){
    $api->get('collections/{collection}', function(){
        return 'test';
    });
});
```

First we create a new instance of the api router that is provided with the `dingo/api` package. Afterwards we add a new version group, because the router needs to know for which version this route will be used. Afterwards we have a simple routing statement to return test when the route is called using a get request. Lumen automatically sets the status code to `OK` if we return anything, so our tests should pass.

In the next part of this series we will add more tests and create our controller to return useful data.
