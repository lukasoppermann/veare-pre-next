'use strict'

const Model = require('./Model')
const CategoryTransformer = require('../transformer/CategoryTransformer')

class Category extends Model {
  constructor (cache) {
    super(cache, CategoryTransformer, {
      contentType: 'category',
      type: 'Entry'
    })
  }
}

module.exports = Category
