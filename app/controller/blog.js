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
    self.render(res, 'blog', {
      posts: posts.all()
    })
  }

  get(req, res) {
    // res.send(posts.findBySlug(req.params[0]))
    self.renderMaster(res, 'partials/blog/article', posts.findBySlug(req.params[0]))
  }

  categories (req, res) {
    res.writeHeader(200, {'Content-Type': 'text/html'})
    res.write('<body>üos</body>')
    res.end()
  }

}

module.exports = Blog
