'use strict'

const express = require('express')
const path = require('path')
let router = express.Router()
let publicDir = 'public'
let blog = require('./blog')()

router.use(express.static(publicDir))

// router.use('/error', function (req, res) {
//   process.exit()
// })

router.get(/^\/(home|contact)/, function (req, res) {
  res.sendFile(path.resolve(publicDir, 'index.html'))
})

router.get(/^\/blog/, blog.post)
//
// router.get(/^\/([\w-]+)\/?$/, function (req, res) {
//   res.sendFile(path.resolve(publicDir, `${req.params[0]}.html`), {}, function (err) {
//     if (err) {
//       res.redirect('/')
//     }
//   })
// })

router.get(/^\/portfolio\/([\w-]+)$/, function (req, res) {
  res.sendFile(path.resolve(publicDir, 'portfolio', `${req.params[0]}.html`), {}, function (err) {
    if (err) {
      res.redirect('/#portfolio')
    }
  })
})

module.exports = router
