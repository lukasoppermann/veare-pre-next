'use strict'

const ArticleModel = require('../models/Article')
let articles

class Blog {
  constructor () {
    articles = ArticleModel()
  }

  index (req, res, data) {
    data.posts = articles.all()
    res.render('blog', data)
  }

  get (req, res, data) {
    data.post = articles.findBySlug(req.params[0])
    if (data.post === undefined) {
      return res.redirect(301, 'http://' + req.headers.host + '/blog')
    }
    res.render('article', data)
  }
}

module.exports = () => new Blog()
