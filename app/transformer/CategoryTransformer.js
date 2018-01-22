'use strict'

const Transformer = require('./Transformer')

class CategoryTransformer extends Transformer {
  transform (data) {
    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        slug: this.getContent(data, 'slug'),
        title: this.getContent(data, 'title'),
        description: this.getContent(data, 'description')
      }
    }
  }
}

module.exports = CategoryTransformer
