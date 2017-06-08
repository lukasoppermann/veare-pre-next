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

  index (req, res) {
    posts.all((result) => {
      self.render(res, 'blog', {
        posts: result
      })
    })
  }

  get(req, res) {
    posts.findBySlug(req.params[0], (result) => {
      self.render(res, 'partials/blog/article', result)
    })
  }

  categories (req, res) {
    res.writeHeader(200, {'Content-Type': 'text/html'})
    res.write('<body>üos</body>')
    res.end()
  }

}

module.exports = Blog
