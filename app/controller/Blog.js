'use strict'

const Controller = require('./Controller')
const PostModel = require('../models/Post')
const ArticleModel = require('../models/Article')
let self
let model
let articles

class Blog extends Controller {
  constructor () {
    super()
    model = PostModel()
    articles = ArticleModel()
    self = this
  }

  index (req, res, data) {
    data.posts = [].concat(model.all(), articles.all()).sort((a, b) => {
      let dateA = new Date(a.fields.rawdate)
      let dateB = new Date(b.fields.rawdate)
      if (dateA < dateB) {
        return 1
      }
      if (dateA > dateB) {
        return -1
      }
      return 0
    })
    self.render(req, res, 'blog', data)
  }

  get (req, res, data) {
    data.post = model.findBySlug(req.params[0]) || model.findByAlias(req.params[0]) || articles.findBySlug(req.params[0])
    if (data.post === undefined) {
      return res.redirect(301, 'http://' + req.headers.host + '/blog')
    }
    if (data.post.contentType === 'post') {
      self.render(req, res, 'post', data)
    } else {
      self.render(req, res, 'article', data)
    }
  }
}

module.exports = () => new Blog()
