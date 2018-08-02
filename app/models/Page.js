'use strict'

const Model = require('./Model')
const PageTransformer = require('../transformer/PageTransformer')

class Page extends Model {
  constructor () {
    super(PageTransformer, 'page')
  }

  findBySlug (slug) {
    return this.findByField('slug', slug)
  }
}

module.exports = () => new Page()
