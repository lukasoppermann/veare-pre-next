// import footer from '../../resources/litTemplates/partials/footer'
const express = require('express')
// const { renderToString } = require('@popeindustries/lit-html-server')
const router = express.Router()
const basicAuth = require('express-basic-auth')
const contentfulConfig = require('../config/contentful.js')
const cache = require('../services/cacheService')()

/* =================
// Normal Routes
================= */
router.get(/^\/fragment\/menu$/, (_req, res) => {
  res.render('menu')
})
router.get(/^\/?$/, (_req, res) => {
  res.render('progressive', {
    filesStringify: {
      js: JSON.stringify(cache.get('files').js),
      css: JSON.stringify(cache.get('files').css)
    }
  })
})
router.get(/^\/home$/, async (req, res) => {
  return require('./home')(req, res, {
    // footer: await renderToString(footer)
  })
})
router.use('/portfolio', require('./portfolio'))
router.get('/privacy', (req, res) => require('./pages')(req, res, 'privacy'))
router.get('/about', (_req, res) => { res.redirect('/#about') })
router.get('/contact', (_req, res) => { res.redirect('/#contact') })
router.get('/blog', require('./blog').index)
// router.get('/blog', require('./blog'))
router.get(/^\/blog\/([\w-]+)/, require('./blog').get)
router.get(/^\/work\/([\w-]+)/, require('./projects'))
/* =================
// UTILS
================= */
// return revisioned files json
router.use('/revisionedFiles', require('./revisionedFiles'))
// activate webhook
router.post('/contentful', basicAuth({
  users: {
    [contentfulConfig.webhookUser]: contentfulConfig.webhookPassword
  }
}), require('../services/contentfulWebhook'))
// log non-existent pages
router.get('/:pageCalled', (req, res) => {
  console.log('tried to retrieve non-existing page: ' + req.params.pageCalled)
  res.redirect('/')
})

module.exports = router
