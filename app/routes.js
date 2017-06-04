'use strict'

const express = require('express')
const path = require('path')
let router = express.Router()
const Blog = require('./controller/Blog')
const Webhook = require('./controller/webhook')

let routes = function (cache) {
  let blog = new Blog(cache)
  let webhook = new Webhook(cache)

  // route for static files
  router.use(express.static('public'))

  router.use('/error', function (req, res) {
    console.log('yo')
    process.exit()
  })

  router.get(/^\/(home|contact)/, function (req, res) {
    res.sendFile(path.resolve('public', 'index.html'))
  })

  router.get(/^\/blog\/?$/, blog.index)
  router.get(/^\/blog\/categories/, blog.categories)

  router.get(/^\/webhooks/, webhook.fire.bind(webhook))
  //
  router.get(/^\/([\w-]+)\/?$/, function (req, res) {
    res.sendFile(path.resolve('public', `${req.params[0]}.html`), {}, function (err) {
      if (err) {
        res.redirect('/')
      }
    })
  })

  router.get(/^\/portfolio\/([\w-]+)$/, function (req, res) {
    res.sendFile(path.resolve('public', 'portfolio', `${req.params[0]}.html`), {}, function (err) {
      if (err) {
        res.redirect('/#portfolio')
      }
    })
  })

  return router
}

module.exports = routes
