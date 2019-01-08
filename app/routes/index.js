const express = require('express')
const router = express.Router()
const basicAuth = require('express-basic-auth')
const contentfulConfig = require('../config/contentful.js')
const Pages = require('../controller/Pages')()
const Blog = require('../controller/Blog')()
const Projects = require('../controller/Project')()

/* =================
// Normal Routes
================= */
router.get(/^\/(home)?$/, require('./home'))
router.use('/portfolio', require('./portfolio'))
router.get('/privacy', (req, res) => Pages.get('privacy', req, res))
router.get('/about', (req, res) => { res.redirect('/#about') })
router.get('/contact', (req, res) => { res.redirect('/#contact') })
router.get('/blog', (req, res) => Blog.index(req, res, {}))
router.get(/^\/blog\/([\w-]+)/, (req, res) => Blog.get(req, res, {}))
router.get(/^\/work\/([\w-]+)/, (req, res) => Projects.get(req, res, {
  pageClass: 'Page--work Project',
  htmlClass: 'Temp-Override'
}))
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
