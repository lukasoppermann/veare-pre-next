# vea.re
> Hey, I am Lukas Oppermann, a senior UI/UX designer from Berlin.

![Node.js CI](https://github.com/lukasoppermann/veare/workflows/Node.js%20CI/badge.svg?branch=master)
![Lighthouse audit live site](https://github.com/lukasoppermann/veare/workflows/Lighthouse%20audit%20live%20site/badge.svg)

## Setup local dev environment

### publishing to server

#### 1. setup ssh key with server
#### 2. Install capistrano
```bash
# install capistrano
sudo gem install capistrano
# install capistrano npm
sudo gem install capistrano-npm
```

### Use mkcert to create a cert for localhost
```
brew install mkcert
brew install nss # if you use Firefox
```

When using mkcert the first time, install it:
```
$ mkcert -install
```

Now create a cert for your domain, e.g. `localhost`
```
$ mkcert localhost
```
