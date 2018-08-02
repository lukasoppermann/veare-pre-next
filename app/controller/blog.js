'use strict'

const Controller = require('./Controller')
const PostModel = require('../models/Post')
let self

class Blog extends Controller {
  constructor () {
    super()
    this.model = PostModel()
    self = this
  }

  index (req, res, data) {
    data.posts = this.model.all()
    self.render(req, res, 'blog', data)
  }

  get (req, res, data) {
    data.post = this.model.findBySlug(req.params[0]) || this.model.findByAlias(req.params[0])
    if (data.post === undefined) {
      return res.redirect(301, 'http://' + req.headers.host + '/blog')
    }
    self.render(req, res, 'article', data)
  }
}

module.exports = () => new Blog()
