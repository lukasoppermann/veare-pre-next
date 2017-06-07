'use strict'

const Model = require('./Model')
const PostTransformer = require('../transformer/PostTransformer')

class Post extends Model {
  constructor (cache) {
    super(cache, PostTransformer, {
      contentType: 'post',
      type: 'Entry'
    })
  }

  findBySlug (slug, cb) {
    this.findByField('slug', slug, cb)
  }
}

module.exports = Post
