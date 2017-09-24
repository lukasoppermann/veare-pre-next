'use strict'

const routing = require('./app/services/routing')
const basicAuth = require('express-basic-auth')
const contentfulConfig = require('./app/config/contentful.js')
const contentful = require('./app/services/contentful')
const express = require('express')
const hbs = require('./app/services/expressHandlebars')
// App
const app = express()
// Variables
app.set('views', 'resources/templates') // path to your templates
app.engine('hbs', hbs.engine)
// register new view engine
app.set('view engine', 'hbs')
// works with caching
// app.set('view cache', true)
let routes = routing(app)
// contentful has loaded
contentful(true, routes, (error) => {
  console.log(error)
  // run routes even when contentful connection fails
  routes()
})

// dev
if (process.env.NODE_ENV === 'dev') {
  app.use('/contentful', basicAuth({
    users: {
      [contentfulConfig.webhookUser]: contentfulConfig.webhookPassword
    }
  }), (req, res) => {
    contentful(false, () => {
      res.sendStatus(200)
    })
  })
}
