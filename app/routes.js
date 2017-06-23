'use strict'

const express = require('express')
const path = require('path')
let router = express.Router()
const Blog = require('./controller/Blog')
const Webhook = require('./controller/webhook')

let routes = function () {
  let blog = new Blog()

  // route for static files
  router.use(express.static('public'))

  // router.use('/error', function (req, res) {
  //   process.exit()
  // })

  router.use('/cache', function (req, res) {
    require('memory-cache').clear()
    res.send(require('memory-cache').keys())
  })

  router.get(/^\/(home|contact)/, function (req, res) {
    res.sendFile(path.resolve('public', 'index.html'))
  })

  router.get(/^\/blog\/?$/, blog.index)
  router.get(/^\/blog\/([\w-]+)/, blog.get)

  // router.get(/^\/webhooks/, webhook.fire.bind(webhook))
  // //
  // router.get(/^\/([\w-]+)\/?$/, function (req, res) {
  //   res.sendFile(path.resolve('public', `${req.params[0]}.html`), {}, function (err) {
  //     if (err) {
  //       res.redirect('/')
  //     }
  //   })
  // })

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
