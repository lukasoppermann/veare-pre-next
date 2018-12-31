'use strict'

const Model = require('./ModelOld')
const AuthorTransformer = require('../transformer/AuthorTransformer')

class Author extends Model {
  constructor () {
    super(AuthorTransformer, 'author')
  }
}

module.exports = Author
