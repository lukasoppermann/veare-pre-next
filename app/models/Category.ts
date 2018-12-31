'use strict'

import Model from './Model'
const CategoryTransformer = require('../transformer/CategoryTransformer')

class Category extends Model {
  constructor () {
    super(CategoryTransformer, 'category')
  }
}

module.exports = Category
