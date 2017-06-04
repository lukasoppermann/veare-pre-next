'use strict'

const Controller = require('./Controller')
const Post = require('../models/Post')
let posts
let self

class Blog extends Controller {
  constructor (cache) {
    super()
    self = this
    posts = new Post(cache)
  }

  index (req, res) {
    posts.all((result) => {
      self.render(res, 'blog', {
        posts: result
      })
    })
  }

  categories (req, res) {
    res.writeHeader(200, {'Content-Type': 'text/html'})
    res.write('<body>üos</body>')
    res.end()
  }

  // categories (req, res) {
  //   cache.get('categories', (err, value) => {
  //     if (!err) {
  //       if (value === undefined) {
  //         client.getEntries({
  //           content_type: 'category'
  //         })
  //         .then((response) => {
  //           cache.set('categories', response)
  //           res.send(response.items)
  //         })
  //         .catch((error) => {
  //           res.send(error)
  //         })
  //       } else {
  //         res.send(value.items)
  //       }
  //     }
  //   })
  // }
}

module.exports = Blog
