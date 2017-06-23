'use strict'

const path = require('path')
const hoffman = require('hoffman')
const routes = require('./app/routes')
const contentful = require('./app/services/contentful')
// App
const express = require('express')
const app = express()
// Constants
const PORT = 8080

app.set('views', path.join(__dirname, 'resources/templates')) // path to your templates
app.set('view engine', 'dust')
app.engine('dust', hoffman.__express())
// works with caching
// app.set('view cache', true)

// optionally load all templates into dust cache on server start
hoffman.prime(app.settings.views, function (err) {
  console.log(err)
})

contentful(true, (response) => {
  // load routes
  app.use('/', routes())
  // open port
  app.listen(PORT)
  console.log('Running on http://localhost:' + PORT)
})
