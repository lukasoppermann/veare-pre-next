'use strict'

const routing = require('./app/services/routing')
const contentful = require('./app/services/contentful')
const express = require('express')
const hbs = require('./app/services/expressHandlebars')
// App
const app = express()
// Variables
app.set('views', 'resources/templates/pages') // path to your templates
app.engine('hbs', hbs.engine)
// register new view engine
app.set('view engine', 'hbs')
// works with caching
app.set('view cache', true)
let routes = routing(app)
// contentful has loaded
contentful(routes, (error) => {
  console.log('error: ' + error.errno + ' ----')
  if (error.Error !== undefined) {
    console.error(error.Error)
  } else {
    console.error(error)
  }
  // run routes even when contentful connection fails
  routes()
})
