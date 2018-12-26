const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')
const basicAuth = require('express-basic-auth')
const contentfulConfig = require('../config/contentful.js')
const contentfulWebhook = require('./contentfulWebhook')
const ProjectModel = require('../models/Project')()
const staticFilesMiddleware = require('../middleware/staticFilesMiddleware')()
const revisionedFiles = require('./revisionedFiles')
// Controller
const Blog = require('../controller/Blog')()
const Projects = require('../controller/Project')()
const Pages = require('../controller/Pages')()

let env = process.env.NODE_ENV || 'development'
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
    if (env === 'development') {
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
    app.get(/^\/portfolio\/?$/, (req, res) => {
      res.redirect('/#portfolio')
    })
    // show portfolio item
    app.get(/^\/portfolio\/?([\w-]*)$/, (req, res) => {
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
    app.get(/^\/(home)?$/, (req, res) => Pages.get(req, res, {
      projects: ProjectModel.all(),
      portfolioItems: portfolioItems
    }, 'index'))
    // pages
    app.get(/^\/(privacy)?$/, (req, res) => Pages.get(req, res))
    // About
    app.get(/^\/about\/([\w-]+)?$/, (req, res) => {
      res.redirect('/#about')
    })
    // contact
    app.get(/^\/contact\/([\w-]+)?$/, (req, res) => {
      res.redirect('/#contact')
    })
    // show individual project
    app.get(/^\/work\/([\w-]+)/, (req, res) => {
      return Projects.get(req, res, {
        pageClass: 'Page--work Project',
        htmlClass: 'Temp-Override'
      })
    })
    // Blog
    app.get(/^\/blog\/?$/, (req, res) => Blog.index(req, res, {}))
    app.get(/^\/blog\/([\w-]+)/, (req, res) => Blog.get(req, res, {}))
    // catch all route with logging
    app.get('/:pageCalled', (req, res) => {
      console.log('tried to retrieve non-existing page: ' + req.params.pageCalled)
      res.redirect('/')
    })
    // static content
    app.use(express.static('public', { maxAge: '365d' }))
    // open port
    app.listen(PORT)
    if (env !== 'testing') {
      console.log('Running on http://localhost:' + PORT + ' environment is set to "' + env + '"')
    }
  }
}
