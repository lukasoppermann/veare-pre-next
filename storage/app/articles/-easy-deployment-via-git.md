---
title: Easy deployment with git push
tags: tag1, tag2
author: Lukas Oppermann
---
# Easy deployment via git

Deploying a change of a website via FTP can be very tedious and slow. Either you copy over the entire project, which takes time or you have to go into different folders, to push individual files upstream. If you forget a file the website is down and you have to figure out which file you are missing. Git offers a perfect solution for all those problems, deploying with a simple push.

## The idea behind this method
Hopefully you are already using git to track changes in your project. Git knows all your files and saves only the changed lines for every new version, this makes it extremely light weight fast. Whenever you push your changes to your remote repository on GitHub its pretty fast, because git only needs to transfer the changed lines. We will create a remote repository just like the one on GitHub on our web server and commit changes via push.

## The setup: git on our web server

Of course you will need to have `ssh` access to connect to your server via the command line and the web server needs git installed. If you have at least a medium priced web server (shared hosting is often fine) you probably have or can get `ssh` access.

### ssh keys


- setup bare repository
- add hook
- add remote repository
- push

## Staging server
same as above
