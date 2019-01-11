# Docker for Multi-Web Digital Ocean Server

### Includes
- nginx proxy
- letsencrypt volumne
- letsencrypt add domain script
- letsencrypt cronjob

### Accessing nginx
The nginx build is based on `nginx:alpine` which does not have `bash`. Instead use `dr exec -it nginx sh` to get into the container.

nginx -t
nginx -s reload

### Adding domains
Adding a new domain to let's encrypt via the docker container can be done with the `~/docker/letsencrypt/add_domain` script. The first argument must be the *domain* to be added and the second your *email*.

```
~/docker/letsencrypt/add_domain yourdomain.com you@email.com
```

The `add_domain` script runs the following code:

```
docker run -it --rm --name letsencrypt \
  -v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
  --volumes-from nginx \
  quay.io/letsencrypt/letsencrypt \
  certonly \
  --webroot \
  --webroot-path /var/www/html \
  --agree-tos \
  --renew-by-default \
  -d yourdomain.com \
  -m you@email.com
```

### Renewal

**Testing renewal**

```
docker run -it --rm --name letsencrypt \
  -v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
  --volumes-from nginx \
  quay.io/letsencrypt/letsencrypt \
  renew \
  --text \
  --dry-run
```

**Actual renewal**

```
docker run -it --rm --name letsencrypt \
  -v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
  --volumes-from nginx \
  quay.io/letsencrypt/letsencrypt \
  renew \
  --text
```

This should be done by `letsencrypt/cron_letsencrypt`. To activate it symlink it to `/etc/cron.daily/cron_letsencrypt`.

```
ln -s ~/docker/letsencrypt/cron_letsencrypt /etc/cron.daily/cron_letsencrypt
```

### Network
The global network `docker_appnet` is available. Add it to website dockers like so:

```
networks:
    docker_appnet:
        external: true
```

### Installation
1. Clone the repositiory into your home/webroot directory.
```
sudo git clone -b master --single-branch --depth=1 https://github.com/lukasoppermann/proxy
```
2. Run `docker-compose up -d` from within the new `proxy` directory
3. Set permissions of `/home/sites` & `/home/letsencrypt` to deploy user
```
sudo chown deploy:docker sites
sudo chown deploy:docker letsencrypt
```
4. (SKIP if you copy old certificates with `dhparam.pem`) Create the `dhparam.pem` in the now newly created `letsencrypt` directory
```bash
# from within /home/proxy
cd ../letsencrypt
sudo openssl dhparam -out dhparam.pem 2048
```
5. Add or copy certificates onto server
```bash
# copy certificates FROM Server TO local
scp -r deploy@46.101.143.234:/home/letsencrypt ./letsencrypt
# copy files & folders within letsencrypt_backup FROM local TO Server
scp -r ./letsencrypt_backup/* deploy@46.101.143.234:/home/letsencrypt
```
6. Start nginx within project folder for node server

### Cronjob to run renewal
Add the following scripts to be executed by the users `crontab`.

First set the right `chmod` and `chown`.
```bash
sudo chown root cron_letsencrypt && sudo chown root restart_nginx
sudo chmod 755 cron_letsencrypt && sudo chmod 755 restart_nginx
```

Afterwards add them to the crontab with `crontab -e` to edit.

```bash
30 18 * * *  /home/proxy/letsencrypt_scripts/cron_letsencrypt >> /home/proxy/logs/cron.log 2>&1
35 18 * * * /home/proxy/letsencrypt_scripts/restart_nginx >> /home/proxy/logs/cron.log 2>&1
```
