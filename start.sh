#!/bin/bash
if [ -z "$NODE_ENV" ]; then
    export NODE_ENV=production
fi
## install npm dependencies
#cd /usr/app/current
npm install --save --prod
## start server
forever start -v -c node_modules/.bin/ts-node app/server.ts -m 5000
