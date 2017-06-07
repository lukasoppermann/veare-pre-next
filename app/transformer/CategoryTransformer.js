'use strict'

const Transformer = require('./Transformer')

class CategoryTransformer extends Transformer {
  transform (data) {
    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        slug: this.getField('slug', data),
        title: this.getField('title', data),
        date: this.getField('description', data),
        color: this.getField('color', data)
      }
    }
  }
}

module.exports = CategoryTransformer
