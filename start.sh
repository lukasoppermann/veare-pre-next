#!/bin/bash
if [ -z "$NODE_ENV" ]; then
    export NODE_ENV=production
fi
## install npm dependencies
#cd /usr/app/current
npm install --save --prod
## start server
#slc run server.js
#node server.js --verbose
#forever start server.js --verbose
forever app.js -m 5000
#slc run
