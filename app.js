'use strict'

const fs = require('fs')
const contentful = require('./app/services/contentful')
const contentfulConfig = require('./app/config/contentful.js')
const Blog = require('./app/controller/Blog')
const express = require('express')
const basicAuth = require('express-basic-auth')
const expressHandlebars = require('express-handlebars')
// App
const app = express()
const blog = new Blog()
// Variables
const PORT = 8080
let env = process.env.NODE_ENV || 'dev'

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
    }
  }
})

app.engine('hbs', hbs.engine)
// register new view engine
app.set('view engine', 'hbs')
// works with caching
// app.set('view cache', true)

// optionally load all templates into dust cache on server start
// hoffman.prime(app.settings.views, function (err) {
//   console.log(err)
// })
// contentful has loaded
contentful(true, (response) => {
  let files = JSON.parse(fs.readFileSync('public/rev-manifest.json', 'utf8'))
  // change object keys
  Object.keys(files).forEach((key) => {
    let newKey = key.replace('.', '').substring(key.lastIndexOf('/') + 1)
    files[newKey] = files[key]
    delete files[key]
  })
  let portfolioItems = JSON.parse(fs.readFileSync('resources/templates/data/portfolio.json'))
  // dev
  if (env === 'dev') {
    app.use(/\/[a-z_/]*/, function (req, res, next) {
      files = JSON.parse(fs.readFileSync('public/rev-manifest.json', 'utf8'))
      // change object keys
      Object.keys(files).forEach((key) => {
        let newKey = key.replace('.', '').substring(key.lastIndexOf('/') + 1)
        files[newKey] = files[key]
        delete files[key]
      })
      // console.log('parsed files: ', files)
      next()
    })

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
  // index
  app.get('/', function (req, res) {
    res.render('index', {
      files: files,
      portfolioItems: portfolioItems
    })
  })
  // home & contact
  app.get(/^\/(home|contact)/, function (req, res) {
    res.render('index', {
      files: files,
      portfolioItems: portfolioItems
    })
  })
  // imprint & privacy
  app.get(/^\/(imprint|privacy)/, function (req, res) {
    res.render(req.params[0], {
      files: files
    })
  })
  // Blog
  app.get(/^\/blog\/?$/, (req, res) => blog.index(req, res, {
    files: files
  }))
  app.get(/^\/blog\/([\w-]+)/, (req, res) => blog.get(req, res, {
    files: files
  }))
  // Portfolio
  app.get(/^\/portfolio\/?([\w-]*)?$/, function (req, res) {
    res.render('portfolio/' + req.params[0], {
      files: files
    }, function (err, html) {
      if (err) {
        console.log(err)
        res.redirect('/#portfolio')
      }
      res.send(html)
    })
  })
  // static content
  app.use(express.static('public'))
  // open port
  app.listen(PORT)
  console.log('Running on http://localhost:' + PORT + ' environment is set to "' + env + '"')
})
