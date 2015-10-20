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
Perfect! Now that we have npm up and running lets get into gulp. You need to install gulp globally first and as a local dependency in your project as well. This is a special gulp thing, and not really important, so I won't go into it.

```bash
# install gulp globally
npm install --global gulp
# install gulp in your project
# make sure to cd into your project first
npm install --save-dev gulp
```
