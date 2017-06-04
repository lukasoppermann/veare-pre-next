'use strict'

const path = require('path')
const express = require('express')
const hoffman = require('hoffman')
const NodeCache = require('node-cache')
const cache = new NodeCache()
const routes = require('./app/routes')
// Constants
const PORT = 8080
// App
const app = express()

app.set('views', path.join(__dirname, 'resources/templates')) // path to your templates
app.set('view engine', 'dust')
app.engine('dust', hoffman.__express())
// works with caching
// app.set('view cache', true)

// optionally load all templates into dust cache on server start
hoffman.prime(app.settings.views, function (err) {
  console.log(err)
})
// app.use(jsonBody())
// app.use(express.session({ secret: 'very_unique_secret_string',
//   cookie: { maxAge: 1800000 }}))
// load routes
app.use('/', routes(cache))

app.listen(PORT)
console.log('Running on http://localhost:' + PORT)
