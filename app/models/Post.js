'use strict'

const Model = require('./Model')
const PostTransformer = require('../transformer/PostTransformer')

class Post extends Model {
  constructor () {
    super(PostTransformer, 'post')
  }

  all () {
    return super.all().sort((a, b) => {
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
  }

  findBySlug (slug) {
    return this.findByField('slug', slug)
  }

  findByAlias (slug) {
    return this.findByArrayField('aliases', slug)
  }
}

module.exports = Post
