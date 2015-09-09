---
title: Why you should always write your own blogging software
---
# Why you should always write your own blogging software
{$meta}
Okay, maybe I lied a bit. There is not "always" on the internet. But sometimes it might really be a good idea to look past the off the shelf products like wordpress or medium.

## The truth about blogging
What do you think is the most important part about your blog? The SEO so people find it? Maybe its the social media integration so your articles are easy to share? Maybe its the design, that has to be perfect? Definitely not, there is only one thing that is important about your blog: **It needs good content**. Nothing else matters, everything else can be added on afterwards. If I have an idea I want to start typing immediately. This is why I choose to blog by using markdown files.

## Alternatives
Before we dive in, lets look at the alternatives: Wordpress is pretty powerful, but also very complicated and personally I do not enjoy the writing experience using wordpress. Ghost & Medium have a much better writing experience, but they still have problems. You can not easily write offline (I once lost an entire article, because Medium lost it when coming back online). Also while you might be able to download your data, it is not always easy use it in a different system.

## Setting a goal
We want to get to writing posts as fast as possible, so we need to define an MVP. To start with we only need two page types, a listing of all articles and an individual article. All this is powered by markdown files. Thats it, everything else is a bonus we can add once we have our first posts online.

**Our toolset will include the following:**
- [Laravel](http://laravel.com/) as the php framework of choice
- The [league/commonmark](https://github.com/thephpleague/commonmark) package for parsing markdown files

So lets get started ...

## The setup for our blog
First we need to install laravel and pull in the commonmark package. I am expecting you to have [composer](https://getcomposer.org/) up and running.

```shell
composer create-project laravel/laravel --prefer-dist yourBlog
cd yourBlog
composer require league/commonmark --prefer-dist
```

Now we need to add our first post, so `cd` into `yourBlog` and run the following.

```shell
mkdir storage/app/articles
echo -e "#First Post\nAll in markdown, nice." >> storage/app/articles/first-post.md
```

At this point to probably want to init git for versioning in this project so go ahead and do this. Once you are done, you will notice that the `git status` does not include our posts. This is a problem, because we want to track our posts in git, this is the only versioning we have. So quickly open the `storage/app/.gitignore` file in your favorite editor edit it to look like the following, afterwards you should be able to add your posts to the git history.

```shell
/*
!/articles/
!.gitignore
```

## The setup for our blog

## As a sidenote ...
This whole post and the entire blog is a work in progress which uses exactly this idea. I got frustrated with not publishing because of all the hassle associated with it, so now I am just writing markdown files and only concentrate on the content.
