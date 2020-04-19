const express = require('express')
const router = express.Router()
const basicAuth = require('express-basic-auth')
const contentfulConfig = require('../config/contentful.js')
/* =================
// Normal Routes
================= */
router.get(/^\/fragment\/menu$/, require('./menu'))
router.get(/^\/?$/, require('./home').progressive)
router.get(/^\/home$/, require('./home').index)
router.use(/^\/portfolio\/([\w-]+)/, require('./portfolio'))
router.get('/privacy', require('./pages'))
router.get('/about', (_req, res) => { res.redirect('/#about') })
router.get('/contact', (_req, res) => { res.redirect('/#contact') })
router.get('/blog', require('./blog').index)
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
  console.info('tried to retrieve non-existing page: ' + req.params.pageCalled)
  res.redirect('/')
})

module.exports = router
