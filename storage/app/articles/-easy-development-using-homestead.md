---
title: Easy development using homestead
tags: tag1, tag2
author: Lukas Oppermann
---
# Easy development using homestead

In this post we will setup homestead on your machine and get a Laravel installation up an running. Note, that while homestead is created by Taylor Otwell, the guy behind Laravel & Lumen, you can use it for any php project, no matter what framework you use.

## Why should I use homestead
The main benefit of homestead is that you have a complete setup (Nginx web server, PHP, MySQL, Postgres, Redis, Memcached, Node, etc.) in one installation. Additonally, homestead is maintained by a community so you do not have to worry about keeping it up to date yourself. Homestead checks for updates automatically and you just need to use it. Its a dev environment without the hassle.

## Preparing your machine

If you haven't been living under a rock the last couple of years you probably have most of the following things installed and configured already, but if you are new to the world of programming chances are you are missing one or two of the dependencies, so I will walk you trough the process assuming you have a clean installation of your OS an nothing else. Also note that I work on a mac, if you are running linux or windows, things migth be slightly different.

### GIT
Git is already installed, but I prefere to have control over which version of git I am running, so I suggest to use your own installation. We are not going to activly use git, but git is used by vagrant so we need it. On mac there is [**homebrew**\]() which is a dependency management system for mac, which you can use to easily install & update git and other depenendcies. You can install this using ruby, which comes preinstalled in mac as well. So run the following on your command line to install homebrew and git.

```bash
homebrew installation ...
brew install git
```

To get your mac to actually the homebrew git version, you need to edit or create your `.bash_profile` file and add `/usr/local/bin` to the `PATH` after reopening your command line, `which git` should show the correct path and `git --version` should show the correct version.

```bash
# if you have no bash_profile yet
touch ~/.bash_profile
# now open it
open ~/.bash_profile
```

In your `.bash_profile` add (or edit) the `export PATH` line. The `PATH` variable is basically a line of paths, seperated by colons `:` which at least to me is pretty confusing, but thats the way it works. The importance is from left to right, so now we first look inside `/usr/local/bin` before we look anywhere else.

```bash
export PATH="/usr/local/bin:$PATH"
```

### Installing composer
Git is done, now we need [composer](http://www.getcomposer.org), which is the PHP dependency management tool. We will use this to create a new laravel installation, but even if you do not use Laravel, you should use composer to install your packages. Composer can be installed via ...???

```bash
Installing composer
```

## VirtualBox & Vagrant
Homestead is a [Vagrant](https://www.vagrantup.com/downloads.html) virtual box, which is a virtual machine that runs on [VirtualBox](https://www.virtualbox.org/wiki/Downloads). You do not really need to know how it works, if you do, check out their websites. What you need to know is that homestead runs a virtual server on your machine and mirrors everything from one specific folder to your virtual server.

First download and install [VirtualBox](https://www.virtualbox.org/wiki/Downloads). Just choose the version from the **VirtualBox platform packages** which corresponds to your operating system.

Once you have VirtualBox installed, download and install [Vagrant](https://www.vagrantup.com/downloads.html).

Now that both VirtualBox & Vagrant are installed on your machine, it's time to add homestead by simply running the following command in your command line. This may take a while.

```bash
vagrant box add laravel/homestead
```

## Creating ssh keys

## Adding your first project url to homestead
Wow, we are already done, now lets setup our first project. We want to locally access `http://myapp.dev` in the browser and view our app. To achieve this we need to make our mac process all requests to this url locally, which we can achieve by pointing this url to the ip `192.168.10.10` in the `/etc/hosts` file. Homestead will pick up the requests and if we configure it correctly in the `homestead.yaml` point all requests to a folder we specify. Run `open /etc/hosts` in your command line and add the following line to it.

```bash
192.168.10.10  myapp.dev
```

Save and close the file. Now run `homestead edit` on your command line which will bring up the `homestead.yaml` file. You can probably leave most settings as they are, but I will run you through some of them nevertheless.

- **ip** is the ip homestead listens on, this is must be the same as in your hosts file.
- **authorize** & **keys** are your ssh credentials, which homestead uses to mirror your files to the virtual server.
- **folders** defines the folders that are mirrored to the virtual server, I recommend using the default of `Code` as your folder, so you do not have to change this setting every time you install homestead. `map` is the folder on your machine and `to` the folder on the virtual server.
- **sites** is where you define which url will point to which folder on the virtual server.
- **databases** are the databases homestead will create whenever it is started, note that no migrations are run, its just an empty mysql database.
- **variables** are environment variables that are set on the virtual server.

The only change we have to make in this file whenever we add a new project is to add a new entry in the `sites` section, like the one shown below. We will create a Laravel project in a folder names `myApp`. The `index.php` file for every Laravel project is always in the `public` folder so we have to point our domain to `myApp/public` on our virtual server. If you did not change the `folders` section, the `map` there should point to `/home/vagrant/Code`, we need to prepend this to our project folder, which leads the path `/home/vagrant/Code/myApp/public`.

```bash
sites:
    - map: myapp.dev
      to: /home/vagrant/Code/myApp/public
```

Every time you add a new site to homestead you need to run `homestead destroy` to terminate the virtual server and `homestead up` to start it back up again. **Be aware** that this deletes all your databases on your homestead machine! So if your app relies on some data being available you will need to `ssh` into the server and run the migration & seeding scripts.

## Creating your project

All is done, we are just missing the project. If you do not already have a `Code` folder create one `mkdir ~/Code` and `cd` into it: `cd ~/Code`. Now you can create a new project using the `composer create-project` command and you should be able to see the Laravel welcome page.

```bash
composer create-project laravel/laravel --prefer-dist myApp
```
