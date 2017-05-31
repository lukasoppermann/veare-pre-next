///<reference path="./node_modules/@types/node/index.d.ts" />
///<reference path="./node_modules/@types/node-cache/index.d.ts" />
///<reference path="./node_modules/contentful/index.d.ts" />

'use strict'

const express = require('express')
const NodeCache = require('node-cache')
const cache = new NodeCache()
const routes = require('./app/routes')
const Contentful = require('./app/services/contentful')
const contentful = new Contentful(cache)
// Constants
const PORT = 8080
// App
const app = express()
// get content
contentful.sync()
// load routes
app.use('/', routes(cache))

app.listen(PORT)
console.log('Running on http://localhost:' + PORT)
