---
title: Getting into gulp
tags: tag1, tag2
author: Lukas Oppermann
---

# Getting into gulp
> [Gulp](http://gulpjs.com/) is my favorite task runner, because it is the essence of simplicity.

Before we get our hands dirty, let me quickly explain what a task runner is. Actually it is pretty straight forwards, a task runner is a very simple (commandlie) tool to run common tasks for you. Okay, but what are tasks? A task can be nearly anything: converting your less to css, minifying your javascript, optimizing your svgs, creating an svg sprite or a combination of the before mentioned.

For this example we will be creating a task that watches our less files and whenever we change them, converts the less files to css, adds all needed vendor-prefixes and combines and minifies the bunch.

## Install npm
Before we can install gulp, we need a tool to install gulp, this tool is npm, the [node package manager](https://docs.npmjs.com/getting-started/what-is-npm). Installing it is as easy as [downloading](https://nodejs.org/en/) an installer and running it.

Now you should be able to get the current npm version by running `npm -v` in your terminal app. You can update npm via npm, with the following command in your terminal.

```bash
sudo npm install npm -g
```

`Cd` into your project so we can start setting it up.
```bash
# move to the folder where you store all your projects
cd ~/Code
# create a new folder if you haven't already
mkdir newProject
# move into the new folder
cd newProject
```
Now we need to initialize npm by running `npm init`. This will create a new `package.json` file for us, which will be used to track the gulp packages we install.

Run `npm init` and hit `return` to accept the suggested values (the value in parentheses) until there are no more questions. If you have no idea, just hit `return`, as you can always change those values in the package.json later on. Once you hit `return` after the question *Is this ok? (yes)* your package.json should be created and look something like the one below. If you are building a website without using node, all that really matters are the `devDependencies`.

```javascript
{
  "name": "project name",
  "version": "1.0.0",
  "description": "Your projects description",
  "main": "index.js",
  "dependencies": {},
  "devDependencies": {
      "gulp": "^3.9.0",
      "gulp-less": "^3.0.3"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Lukas Oppermann",
  "license": "MIT"
}
```
## Install gulp
Perfect! Now that we have npm up and running lets get into gulp. You need to install gulp globally first and as a local dependency in your project as well. This is a special gulp thing, and not really important, so I won't go into it. Afterwards we need to create a `gulfile.js` in the root of our project. This file will contain all our tasks.

```bash
# install gulp globally
npm install --global gulp
# install gulp in your project
# make sure to cd into your project first
npm install --save-dev gulp
# create an empty gulpfile.js
touch gulpfile.js
```

Open up the `gulfile.js` in your editor of choice. As the extension `.js` suggests, this is a normal javascript file, so if you know how to write javascript, you know how to work in this file. If not, don't worry, it's easy.

```javascript
// we need to load gulp, since we are running npm, we can use the require function
var gulp = require('gulp');
// creating our first task
// you give a task any name (first argument), it will be used when running the task from the terminal like: gulp compile-less
gulp.task('compile-less', function() {
    // within this function we will define what the task does
});
```

## Creating the first task

Perfect, so now we can start to write the actual jobs the task has to perform, but first we need to install and load all plugins we need. You can find plugins on [npm.js](http://npmjs.org). Our first step is to convert our `.less` files to `.css` and combine them into one. For this we need two plugins: `gulp-less` will be used to convert our `.less` and `gulp-concat` will be used to combine our css into one file.

```bash
# you can install multiple npm modules at once like this:
npm install --save-dev gulp-less gulp-concat
```

After adding the two new modules your `gulpfile.js` should look like the one below.

```javascript
var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');

gulp.task('compile-less', function() {
    // every task needs to return something
    // using gulp.src we can read all files with
    // a .less extension from a given directory
    return gulp.src('./resources/less/*.less')
        // once we have our files we use the .pipe function,
        // it takes another function as an argument, gulp plugins
        // come as functions, so less is the variable name we defined above
        .pipe(less())
        // just as above we now use the concat plugin, it takes an
        // argument, which is the filename of our combined css
        .pipe(concat('app.css'))
        // lastly we use gulp.dest to write the to the file system
        // the argument is the path at which the file is stored
        .pipe(gulp.dest('public/css'));
});
```

With this our first gulp task is done. You can use it by running `gulp compile-less` from your terminal. Afterwards a file named `app.css` should be created within `public/css` (or where ever you decided to have gulp save it).

## Extending our task
Now that we have the basic working, we will add the autoprefixer to it. First we need to download the plugin for it.

```bash
npm install --save-dev gulp-autoprefixer
```

Once this is done we add the plugin to our `gulpfile.js` and use the autoprefixer within a `pipe` statement.

```javascript
var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('compile-less', function() {

    return gulp.src('./resources/less/*.less')
        .pipe(less())
        .pipe(concat('app.css'))
        // the autoprefixer function takes an object as an argument
        // which lets you define which versions you want to support
        .pipe(autoprefixer({
          browsers: ['last 2 versions', 'IE 9', 'IE 8'],
          cascade: false
        }))
        .pipe(gulp.dest('public/css'));
});
```

Now if you use css like `animation` it will be automatically prefixed for the browsers you specified.

## The default task
There are two special tasks you can create on gulp, let's start with the `default`, which you create by simply naming a task `default`. The special part about this task, is that you can call it by simply typing `gulp` without any argument into the terminal. Obviously this should be used for your most common task. In your `gulpfile.js` create the default task to call the `compile-less` task.

```javascript
// instead of a function, you can also provide an array as the tasks' argument
// if you do this, all tasks in this in the array will be run
gulp.task('default', ['compile-less']);
```

## Watch your files
With your less files you probably want to compile them after every change which is very annoying, if done by hand. Luckily there is a way to avoid this, the *watch task*. Create a *watch task* that compiles all less files, once you change one is as easy as writing a normal task. We will just facilitate the `watch` method on the `gulp` object to tell us when a file changes, and run the appropriate task.

```javascript
// a watch task keeps an eye on the files specified as the first argument
// and runs the tasks from the second argument on change
gulp.task('watch-less', function(){
    gulp.watch(['./resources/less/*.less'], ['compile-less']);
});
```

If you now run `gulp watch-less` from the terminal your files will be recompiled the next time you save them. **Beware:** When adding new files you need to stop the watcher `ctrl + c` and restart it by running `gulp watch-less`.
There is one annoyance left: You need to actively trigger the watch task. But we can help this, by simply appending it to your default array.

```javascript
// now gulp will compile our less files and start the watch task
// when we run gulp in the terminal
gulp.task('default', ['compile-less', 'watch-less']);
```

This is it, for our first dive into gulp. It may seem a little complicated, but it is just basic javascript. Once you get used to it for a while it will be easy to whip up new tasks and when you go back to a project without gulp you will loathe the many manual steps you have to do.
