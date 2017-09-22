'use strict'

const fs = require('fs')
const contentful = require('./app/services/contentful')
const contentfulConfig = require('./app/config/contentful.js')
const Blog = require('./app/controller/Blog')
const express = require('express')
const basicAuth = require('express-basic-auth')
const expressHandlebars = require('express-handlebars')
const SVGO = require('svgo')
const svgo = new SVGO({
  plugins: [
    { removeEditorsNSData: {
      additionalNamespaces: ['http://www.figma.com/figma/ns']}
    },
    { removeDesc: {removeAny: true} },
    { removeTitle: {} }, // pass it an argument to enable
    'removeComments', // does enable default plugins. (using { full: true } )
    'removeMetadata'
  ]
})
// App
const app = express()
const blog = new Blog()
// Variables
const PORT = process.env.NODE_PORT || 8080
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
    },
    inline_svg: function (path, options) {
      let svg = fs.readFileSync(path, 'utf8')
      let optimized
      svgo.optimize(svg, function (result) {
        optimized = result.data
      })

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
      pageClass: 'c-page--index',
      portfolioItems: portfolioItems
    })
  })
  // home & contact
  app.get(/^\/(home|contact)/, function (req, res) {
    res.render('index', {
      files: files,
      pageClass: 'c-page--index',
      portfolioItems: portfolioItems
    })
  })
  // imprint & privacy
  app.get(/^\/(imprint|privacy)/, function (req, res) {
    res.render(req.params[0], {
      files: files,
      pageClass: 'c-page--' + req.params[0]
    })
  })
  // About
  app.get(/^\/about\/([\w-]+)?$/, function (req, res) {
    res.redirect('/#about')
  })
  // Blog
  app.get(/^\/blog\/?$/, (req, res) => blog.index(req, res, {
    files: files,
    pageClass: 'c-page--blog',
    layout: 'main-without-footer'
  }))
  app.get(/^\/blog\/([\w-]+)/, (req, res) => blog.get(req, res, {
    files: files,
    pageClass: 'c-page--blog',
    layout: 'main-without-footer'
  }))
  // Portfolio
  // no portfolio item selected
  app.get(/^\/portfolio\/?$/, function (req, res) {
    res.redirect('/#portfolio')
  })
  // show portfolio item
  app.get(/^\/portfolio\/?([\w-]*)$/, function (req, res) {
    res.render('portfolio/' + req.params[0], {
      files: files,
      pageClass: 'c-page--portfolio-item'
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
  if (env !== 'testing') {
    console.log('Running on http://localhost:' + PORT + ' environment is set to "' + env + '"')
  }
})
