'use strict'

const Model = require('./Model')
const CategoryTransformer = require('../transformer/CategoryTransformer')

class Category extends Model {
  constructor () {
    super(CategoryTransformer, {
      contentType: 'category',
      type: 'Entry'
    })
  }
}

module.exports = Category
