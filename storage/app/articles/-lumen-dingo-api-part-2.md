---
title: API with dingo & lumen\: Database & Transformers - PART 2
tags: tag1, tag2
author: Lukas Oppermann
description: Learn how to build a php API with dingo & lumen: database & transformers.
---
# API with dingo & lumen: Database & Transformers
{$meta}

> In the [introduction]() of this series we setup our dev environment & installed all needed resources. Afterwards we configured dingo/api and setup a route as well as a basic phpunit test. In this part we will create the controller, database, models and improve our tests.

## Creating your sqlite database
Before anything can work, we need to add some data. I recommend working with *sqlite*, especially during development, as it requires no setup outside of your application. To setup *sqlite*, first you need to set your DB environment variable, which will be inside your `.env` file during development. Add `DB_CONNECTION=sqlite` to this file and save it.

Now you need to create the `database.sqlite` file. The easiest way is to run `touch database/database.sqlite` from within your projects root in the terminal. Make sure it has the correct permissions, it should be *644* or *-rw-r--r--* (you can see permissions in the terminal by using `ls -l`). If the permissions are wrong, just correct them via the terminal:

```bash
$ chmod 644 database.sqlite
```

## Folder structure
Now that we have our database in place we need to create the model. This leads us to the question of where to put this file, or any of our files at all. Generally it is up to you how you structure your api, but I prefer to use a custom folder `Api` to group all files. But you can also use the `Http` folder if you like.

Additionally I find it quite helpful to add version folders, I start with `V1` and if I need to create a new version, I will create a new folder `V2`. This lets me maintain separate versions side by side, without messing up my code by adding custom if clauses within the files. Of course this has the potential of much code duplication, because you will copy all files to a new folder, but I rather have duplicate code, given that the other option is potentially breaking V1 when I was working changing something in V2.

My folder structure looks like this:
<div class="o-list c-file-list">

- myLumenApi/
    - app/
        - V1/
            - Controllers/
            - Models/
            - Transformers/
    - bootstrap/
    - database/
    - ...
</div>

## Model
Okay, so that we know where our model lives, we can create the file:

```bash
$ touch app/Api/V1/Models/Collection.php
```

Our `Collection` model is pretty straight forward. We namespace it according to PSR-4 for the autoloading to work, and `use` Eloquent, which provides as with the basic model, which we extend with our own implementation. All we need to do in our Model is to set the `timestamp` option and the `incrementing` option to `false`.

The `timestamp` option automatically adds a created at and modified at column to the table. As our collections have no relevance other than to group our content pieces, we are not interested in knowing about the creation and modification date of those collections. Of course set it to `true` if you actually do care about those dates.

The `incrementing` option states that we use an *auto incrementing* field as an id. This is generally not such a bad option, but we will be using *uuids*, which is why we set it to `false`. The benefit of a *uuid* is that it obfuscates our ids, so nobody can simply guess an id and steal all our content.
Using incrementing ids a script could just query out api for `/collections/1`, `/collections/1`, ... which would be even worse for the actual entries within a collection. This is why I prefer to use uuids even if I am not sure if the ids will be exposed at all. If you want to know more, read [phil's post on uuids](https://philsturgeon.uk/http/2015/09/03/auto-incrementing-to-destruction/).

```php
<?php

namespace App\Api\V1\Models;

use Illuminate\Database\Eloquent\Model;

class Collection extends Model
{
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;
    /**
     * Indicates if the model should force an auto-incrementeing id.
     *
     * @var bool
     */
    public $incrementing = false;
}
```
## Database migration & seeding
Our model is in place so we can move on to our migration. Create a new migration file using the artisan helper in your terminal.

```bash
$ artisan make:migration create_collection_table
```

Now you should have a new migration file, mine is `2015_11_17_183803_create_collection_table.php`. Within this file change the `up` and `down` method to resemble the following example. The `down` method just `drops` the table, the interesting stuff happens within the `up` method. The two *ids* are of the type `binary` because this will be faster than using `char` for storing a *uuid*.

```php
/**
 * Run the migrations.
 *
 * @return void
 */
public function up()
{
    Schema::create('collections', function(Blueprint $table)
    {
        $table->binary('id');
        $table->string('type',255);
        $table->binary('page_id');
        $table->integer('position');
    });
}

/**
 * Reverse the migrations.
 *
 * @return void
 */
public function down()
{
    Schema::drop('collections');
}
```

### Modelfactory
Before we run our migration we will create our seeder, so we end up with actual data in our database and not just the structure. We can use a handy artisan helper to create a seed, similar to how we created the migration.

```bash
$ artisan make:seeder CollectionsTableSeeder
```

At the moment our seed will have only one line, so we could as well add it to `DatabaseSeeder.php` but I like to keep things tidy and you never know when you need to add some logic to your seeders. Open `database/seeds/CollectionsTableSeeder.php` and change it to look like this:

```php
public function run()
{
    factory('App\Api\V1\Models\Collection', 50)->create();
}
```

This will create 50 entries, but we a using a `factory` function, which needs some configuration as well. So lets jump into `database/factories/ModelFactory.php` and replace the existing code with the code below. Lumen comes with [faker](https://github.com/fzaninotto/Faker) out of the box, faker is the supreme packages for creating random data with a specific type e.g. a random *email* or a random *uuid*, so of course we use this in our factory for the collection model. A [model factory](http://laravel.com/docs/5.1/testing#model-factories) is basically a blueprint to tell lumen how to spin up database entries for a given model.

```php
$factory->define(App\Api\V1\Models\Collection::class, function ($faker) {
    $types = ['navigation', 'news'];
    return [
        'id' => $faker->uuid,
        'type' => $faker->randomElement($types),
        'position' => $faker->randomDigit(),
        'page_id' => $faker->uuid,
    ];
});
```
### DatabaseSeeder
The last thing to do before we can migrate & seed our database is to configure the `DatabaseSeeder.php`.


## Controller

## Transform your output

use helpers

create transformer
