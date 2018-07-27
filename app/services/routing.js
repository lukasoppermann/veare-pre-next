const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')
const basicAuth = require('express-basic-auth')
const contentfulConfig = require('../config/contentful.js')
const contentfulWebhook = require('./contentfulWebhook')
const Blog = require('../controller/Blog')
const Portfolio = require('../controller/Portfolio')
const portfolio = new Portfolio()
const blog = new Blog()
const Page = require('../controller/Page')
const page = new Page()
const Project = require('../models/Project')
const project = new Project()
const staticFilesMiddleware = require('../middleware/staticFilesMiddleware')()
const revisionedFiles = require('./revisionedFiles')

let env = process.env.NODE_ENV || 'dev'
const PORT = process.env.NODE_PORT || 8080

module.exports = (app) => {
  return (response) => {
    // ---------------------------------- //
    // MIDDLEWARE
    // ---------------------------------- //
    // middleware to add files to req
    app.use(staticFilesMiddleware)
    app.use(bodyParser.json({ type: 'application/*+json' }))
    app.use(compression())
    // ---------------------------------- //
    // Development
    // ---------------------------------- //
    if (env === 'dev') {
      app.use(require('../middleware/staticFilesReloadMiddleware')())
    }
    // ---------------------------------- //
    // DELETE once new portfolio from cms is done
    // portfolio files
    const fs = require('fs')
    let portfolioItems = JSON.parse(fs.readFileSync('resources/templates/data/portfolio.json'))
    // FILES only needed for portfolio
    let filesForPortfolio = JSON.parse(fs.readFileSync('public/rev-manifest.json', 'utf8'))
    // replace image
    portfolioItems.map(item => {
      item.src = '/' + filesForPortfolio[item.src]
    })
    // Portfolio
    // no portfolio item selected
    app.get(/^\/portfolio\/?$/, function (req, res) {
      res.redirect('/#portfolio')
    })
    // show portfolio item
    app.get(/^\/portfolio\/?([\w-]*)$/, function (req, res) {
      res.render('./portfolio/' + req.params[0] + '.hbs', {
        staticFiles: req.staticFiles,
        pageClass: 'c-page--portfolio-item'
      }, function (err, html) {
        if (err) {
          console.log(err)
          res.redirect('/#portfolio')
        }
        res.send(html)
      })
    })
    // ---------------------------------- //
    // UTILITIES
    // ---------------------------------- //
    // contentful webhook
    app.post('/contentful', basicAuth({
      users: {
        [contentfulConfig.webhookUser]: contentfulConfig.webhookPassword
      }
    }), contentfulWebhook)
    // revisioned files
    app.get('/revisionedFiles', revisionedFiles)
    // ---------------------------------- //
    // PAGE ROUTES
    // ---------------------------------- //
    // index
    app.get(/^\/(home)?$/, (req, res) => page.get(req, res, {
      projects: project.all(),
      portfolioItems: portfolioItems
    }, 'index'))
    // pages
    app.get(/^\/(imprint)?$/, (req, res) => page.get(req, res))
    // imprint & privacy
    app.get(/^\/(privacy)/, function (req, res) {
      res.render(req.params[0], {
        staticFiles: req.staticFiles,
        htmlClass: 'Temp-Override'
      })
    })
    // About
    app.get(/^\/about\/([\w-]+)?$/, function (req, res) {
      res.redirect('/#about')
    })
    // contact
    app.get(/^\/contact\/([\w-]+)?$/, function (req, res) {
      res.redirect('/#contact')
    })
    // Blog
    app.get(/^\/blog\/?$/, blog.index)
    app.get(/^\/blog\/([\w-]+)/, blog.get)
    // show individual project
    app.get(/^\/work\/([a-z0-9]*)/, (req, res) => portfolio.get(req, res, {
      pageClass: 'Page--work',
      htmlClass: 'Temp-Override'
    }))
    // catch all route with logging
    app.get('/:pageCalled', function (req, res) {
      console.log('tried to retrieve non-existing page: ' + req.params.pageCalled)
      res.redirect('/')
    })
    // static content
    app.use(express.static('public', {maxAge: '365d'}))
    // open port
    app.listen(PORT)
    if (env !== 'testing') {
      console.log('Running on http://localhost:' + PORT + ' environment is set to "' + env + '"')
    }
  }
}
