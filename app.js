'use strict'

const path = require('path')
const hoffman = require('hoffman')
const contentful = require('./app/services/contentful')
const contentfulConfig = require('./app/config/contentful.js')
const Blog = require('./app/controller/Blog')
const express = require('express')
const basicAuth = require('express-basic-auth')
// App
const app = express()
const blog = new Blog()
// Variables
const PORT = 8080
let env = process.env.NODE_ENV || 'dev'

app.set('views', path.join(__dirname, 'resources/templates')) // path to your templates
app.set('view engine', 'dust')
app.engine('dust', hoffman.__express())
// works with caching
// app.set('view cache', true)

// optionally load all templates into dust cache on server start
// hoffman.prime(app.settings.views, function (err) {
//   console.log(err)
// })
// contentful has loaded
contentful(true, (response) => {
  // static content
  app.use(express.static('public'))
  // index
  app.use('/^/$/', function (req, res) {
    res.sendFile(path.resolve('public', 'index.html'))
  })
  // home & contact
  app.get(/^\/(home|contact)/, function (req, res) {
    res.sendFile(path.resolve('public', 'index.html'))
  })
  // imprint & privacy
  app.get(/^\/(imprint|privacy)/, function (req, res) {
    res.sendFile(path.resolve('public', `${req.params[0]}.html`))
  })
  // Blog
  app.get(/^\/blog\/?$/, blog.index)
  app.get(/^\/blog\/([\w-]+)/, blog.get)
  // Portfolio
  app.get(/^\/portfolio\/([\w-]*)$/, function (req, res) {
    res.sendFile(path.resolve('public', 'portfolio', `${req.params[0]}.html`), {}, function (err) {
      if (err) {
        res.redirect('/#portfolio')
      }
    })
  })
  // dev
  if (env === 'dev') {
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
  // open port
  app.listen(PORT)
  console.log('Running on http://localhost:' + PORT)
})
