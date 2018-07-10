const fs = require('fs')
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

let env = process.env.NODE_ENV || 'dev'
const PORT = process.env.NODE_PORT || 8080

module.exports = (app) => {
  return (response) => {
    let files = JSON.parse(fs.readFileSync('public/rev-manifest.json', 'utf8'))
    // revisioned css & js files
    let revisionedFiles = Object.keys(files)
      .filter(key => key.substr(-3) === 'css' || key.substr(-2) === 'js')
      .reduce((obj, key) => {
        obj[key] = files[key]
        return obj
      }, {})
    // portfolio files
    let portfolioItems = JSON.parse(fs.readFileSync('resources/templates/data/portfolio.json'))
    // replace image
    portfolioItems.map(item => {
      item.src = '/' + files[item.src]
    })
    // dev
    if (env === 'dev') {
      app.use(/\/[a-z_/]*/, function (req, res, next) {
        files = JSON.parse(fs.readFileSync('public/rev-manifest.json', 'utf8'))
        revisionedFiles = Object.keys(files)
          .filter(key => key.substr(-3) === 'css' || key.substr(-2) === 'js')
          .reduce((obj, key) => {
            obj[key] = files[key]
            return obj
          }, {})
        next()
      })
    }
    //
    app.use(bodyParser.json({ type: 'application/*+json' }))
    app.use(compression())
    // contentful webhook
    app.post('/contentful', basicAuth({
      users: {
        [contentfulConfig.webhookUser]: contentfulConfig.webhookPassword
      }
    }), contentfulWebhook)
    // revisioned files
    app.get('/revisionedFiles', function (req, res) {
      res.json(revisionedFiles)
    })
    // index
    app.get(/^\/(home)?$/, (req, res) => page.get(req, res, {
      files: files,
      pageClass: 'c-page--index',
      projects: project.all(),
      portfolioItems: portfolioItems
    }))
    // imprint & privacy
    app.get(/^\/(imprint|privacy)/, function (req, res) {
      res.render(req.params[0], {
        files: files,
        pageClass: 'c-page--' + req.params[0] + ' page--' + req.params[0],
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
    app.get(/^\/blog\/?$/, (req, res) => blog.index(req, res, {
      files: files,
      pageClass: 'c-page--blog'
    }))
    app.get(/^\/blog\/([\w-]+)/, (req, res) => blog.get(req, res, {
      files: files,
      pageClass: 'c-page--blog'
    }))
    // Portfolio
    // no portfolio item selected
    app.get(/^\/portfolio\/?$/, function (req, res) {
      res.redirect('/#portfolio')
    })
    // show portfolio item
    app.get(/^\/portfolio\/?([\w-]*)$/, function (req, res) {
      res.render('./portfolio/' + req.params[0] + '.hbs', {
        files: files,
        pageClass: 'c-page--portfolio-item'
      }, function (err, html) {
        if (err) {
          console.log(err)
          res.redirect('/#portfolio')
        }
        res.send(html)
      })
    })
    // catch all route with logging
    app.get('/:pageCalled', function (req, res) {
      console.log('tried to retrieve non-existing page: ' + req.params.pageCalled)
      res.redirect('/')
    })
    // show individual project
    app.get(/^\/work\/([a-z0-9]*)/, (req, res) => portfolio.get(req, res, {
      files: files,
      pageClass: 'Page--work',
      htmlClass: 'Temp-Override'
    }))

    // static content
    app.use(express.static('public', {maxAge: '365d'}))
    // open port
    app.listen(PORT)
    if (env !== 'testing') {
      console.log('Running on http://localhost:' + PORT + ' environment is set to "' + env + '"')
    }
  }
}
