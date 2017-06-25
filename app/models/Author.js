'use strict'

const Model = require('./Model')
const AuthorTransformer = require('../transformer/AuthorTransformer')

class Author extends Model {
  constructor () {
    super(AuthorTransformer, 'author')
  }
}

module.exports = Author
