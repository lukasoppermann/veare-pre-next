'use strict'

const Controller = require('./Controller')
const Post = require('../models/Post')
let posts
let self

class Blog extends Controller {
  constructor () {
    super()
    self = this
    posts = new Post()
  }

  index (req, res, data) {
    data.posts = posts.all()
    self.render(res, 'blog', data)
  }

  get (req, res, data) {
    data.post = posts.findBySlug(req.params[0]) || posts.findByAlias(req.params[0])
    if (data.post === undefined) {
      return res.redirect(301, 'http://' + req.headers.host + '/blog')
    }
    self.render(res, 'article', data)
  }
}

module.exports = Blog
