'use strict'

const express = require('express')
const path = require('path')
let router = express.Router()
let basicAuth = require('express-basic-auth')
const Blog = require('./controller/Blog')
const contentful = require('./services/contentful')
const contentfulConfig = require('./config/contentful.js')
const forever = require('forever')

let routes = function () {
  let blog = new Blog()

  // route for static files
  router.use(express.static('public'))

  // router.use('/error', function (req, res) {
  //   process.exit()
  // })
  let users = {}
  users[contentfulConfig.webhookUser] = contentfulConfig.webhookPassword
  router.use('/contentful', basicAuth({
    users: users
  }), (req, res) => {
    contentful(false, () => {
      res.sendStatus(200)
    })
  })

  router.use('/cache', function (req, res) {
    // res.send(require('memory-cache').get('post'))
    require('memory-cache').clear()
    res.send(require('memory-cache').keys())
  })

  router.get(/^\/(home|contact)/, function (req, res) {
    res.sendFile(path.resolve('public', 'index.html'))
  })

  router.get(/^\/(imprint|privacy)/, function (req, res) {
    res.sendFile(path.resolve('public', `${req.params[0]}.html`))
  })

  router.get(/^\/blog\/?$/, blog.index)
  router.get(/^\/blog\/([\w-]+)/, blog.get)

  router.get(/^\/portfolio\/([\w-]*)$/, function (req, res) {
    res.sendFile(path.resolve('public', 'portfolio', `${req.params[0]}.html`), {}, function (err) {
      if (err) {
        res.redirect('/#portfolio')
      }
    })
  })

  return router
}

module.exports = routes
