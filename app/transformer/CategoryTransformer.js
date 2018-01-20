'use strict'

const Transformer = require('./Transformer')

class CategoryTransformer extends Transformer {
  transform (data) {
    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        slug: data.fields['slug'],
        title: data.fields['title'],
        description: data.fields['description']
      }
    }
  }
}

module.exports = CategoryTransformer
