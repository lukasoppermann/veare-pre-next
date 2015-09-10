---
title: API with lumen & dingo/api - PART 1
tags: tag1, tag2
author: Lukas Oppermann
---
# API with dingo & lumen - PART 1
{$meta}
In this series we will write a well tested api using [lumen](http://lumen.laravel.com/) and the [dingo/api](https://github.com/dingo/api) package. We are going to build a well-tested api for storing and retrieving posts.

## Install lumen & dingo/api

I assume you have composer installed on your machine and a basic knowledge of how to use the commandline.
So lets start installing lumen via the composer `create-project` command.
```bash
composer create-project laravel/lumen --prefer-dist myLumenApi
```

Now we can `cd` into our project and install dingo/api.
```bash
cd myLumenApi
composer require dingo/api:1.0.x@dev --prefer-dist
```

We need to do a little configuration before we can start to build our api, so jump over to your IDE and open `bootstrap/app.php`.

In lumen you can store environment variables in a file named `.env`. On your production server you would set up real environment variables, but for development this is much easier. For this to work, simply uncomment line 5 in the `app.php` file.

```php
Dotenv::load(__DIR__.'/../');
```

Lumen ships with eloquent, the excellemt ORM you know from laravel. Some people might argue that you need to implement a repository pattern to be able to easily switch out your ORM without having to edit all your controllers, but I would say that in most cases this is premature optimization. You can still implement a repository pattern the first time you actually switch out your database access layer.

Anyway, eloquent will not be loaded by default, so we need to uncomment line 24 in the `app.php` file to use it.
```php
$app->withEloquent();
```

To get the `dingo/api` packges loaded all we need to do is register the `LumenServiceProvider` in the `app.php` file. To do so, add the following  at line 80:

```php
$app->register(Dingo\Api\Provider\LumenServiceProvider::class);
```

## Setting up homestead
I expect you to have a working version of homestead on your machine, if not, follow the instructions on the [homestead installation page](http://laravel.com/docs/master/homestead) and setup homestead. Once you are done we need to add a new domain to it, so lets move over to the terminal.

First we need to edit the `/etc/hosts` file, run `atom /etc/hosts` in your command line. You can substitude `atom` for any editor you have installed which has a cli implementation, like sublime or textmate. Add the following line to this file and save it.

```bash
192.168.10.10  api.mylumenapi.app
```

Now open the `Homestead.yaml` file with the following command `homestead edit`. Add a new entry under the `sites` section.

```javascript
- map: api.mylumenapi.app
  to: /home/vagrant/Code/mylumenapi/public
```

You might need to destroy your vm and restart it, to get this to work. Do this by running the following commands in your command line:
```bash
homestead destroy
homestead up
```

If everything went according to plan, you should be able to see the lumen welcome page when accessing your domain `api.mylumenapi.app`.

## Configure dingo/api

Configuring dingo is fairly easy: open your `.env` file and lets get started. The [ding/api documentation](https://github.com/dingo/api/wiki/Configuration) is actually pretty good for most cases.


**API_STANDARDS_TREE=vnd**   
If your api is publically available or at any point will be, use the vendor tree `vnd`. The personal tree `prs`, is meant for not distributed projects.

**API_SUBTYPE=yourVendorName**
This is the name of your project or application. Github for e.g. uses `github`

**API_PREFIX=/**
For dingo to work you need to provide either a prefix or a subdomain, but subdomain routing does not work under lumen and in any case this app is nothing else but an api, so we choose a prefix of `/` which basically means our base url for the api is our url (api.mylumenapi.app).

**API_VERSION=v1**
The version option specifies our default version, that is used whenever a request does not specify a version. This should always track your most recent version. Make sure to advise your api user that they should always specify an api version so they are not suprised by breaking changes that come with a new version.

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
