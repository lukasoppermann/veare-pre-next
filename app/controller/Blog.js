'use strict'

const Controller = require('./Controller')
const PostModel = require('../models/Post')
let self
let model

class Blog extends Controller {
  constructor () {
    super()
    model = PostModel()
    self = this
  }

  index (req, res, data) {
    data.posts = model.all()
    self.render(req, res, 'blog', data)
  }

  get (req, res, data) {
    data.post = model.findBySlug(req.params[0]) || model.findByAlias(req.params[0])
    if (data.post === undefined) {
      return res.redirect(301, 'http://' + req.headers.host + '/blog')
    }
    self.render(req, res, 'article', data)
  }
}

module.exports = () => new Blog()
