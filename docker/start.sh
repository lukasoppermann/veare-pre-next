#!/bin/bash
if [ -z "$NODE_ENV" ]; then
    export NODE_ENV=production
fi
## install npm dependencies
cd /usr/app/current
npm install --save --prod
## start server
cd /usr/app/current
#slc run server.js
#forever start server.js --verbose
node server.js
