import contentful from '../services/contentful'
const express = require('express')
const router = express.Router()
const basicAuth = require('express-basic-auth')
const contentfulConfig = require('../config/contentful.js')
/* =================
// Normal Routes
================= */
router.get(/^\/fragment\/menu$/, require('./menu'))
// ## Home
router.get(/^\/?$/, require('./home').progressive)
router.get(/^\/home$/, (req, res) => require('./pages')(req, res, 'homepage'))
// ## Portfolio
router.use(/^\/portfolio\/([\w-]+)/, require('./portfolio'))
// ## Privacy
router.get('/privacy', (req, res) => require('./pages')(req, res, 'page'))
// ## About
router.get('/about', (_req, res) => { res.redirect('/#about') })
// ## Contact
router.get('/contact', (_req, res) => { res.redirect('/#contact') })
// ## Blog
router.get('/blog', require('./blog').index)
router.get(/^\/blog\/([\w-]+)/, require('./blog').get)
// ## Work
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
}), contentful)
// log non-existent pages
router.get('/:pageCalled', (req, res) => {
  console.info('tried to retrieve non-existing page: ' + req.params.pageCalled)
  res.redirect('/')
})

module.exports = router
