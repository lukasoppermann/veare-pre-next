'use strict'

const Controller = require('./Controller')
const ArticleModel = require('../models/Article')
let self
let articles

class Blog extends Controller {
  constructor () {
    super()
    articles = ArticleModel()
    self = this
  }

  index (req, res, data) {
    data.posts = articles.all()
    self.render(req, res, 'blog', data)
  }

  get (req, res, data) {
    data.post = articles.findBySlug(req.params[0])
    if (data.post === undefined) {
      return res.redirect(301, 'http://' + req.headers.host + '/blog')
    }
    self.render(req, res, 'article', data)
  }
}

module.exports = () => new Blog()
