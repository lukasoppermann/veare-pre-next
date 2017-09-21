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
const hbs = expressHandlebars.create({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: 'resources/templates/layouts',
  partialsDir: 'resources/templates/partials',
  helpers: {
    url_safe: function (url) {
      url = url.replace(/[`:]/g, '').replace(/[\W_]+/g, '-')
      return escape(url)
    },
    inline_svg: function (path, options) {
      let svg = fs.readFileSync(path, 'utf8')
      let optimized
      svgo.optimize(svg, function (result) {
        optimized = result.data
      })
      console.log(options.hash)
      let attrs = Object.keys(options.hash || {}).map(function (key) {
        return key + '="' + options.hash[key] + '"'
      }).join(' ')

      return optimized.replace(/<svg/g, `<svg ${attrs}`)
    }
  }
})

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
