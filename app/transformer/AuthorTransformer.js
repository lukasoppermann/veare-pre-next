'use strict'

const Transformer = require('./Transformer')

class AuthorTransformer extends Transformer {
  transform (data) {
    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        slug: this.getContent(data, 'slug'),
        name: this.getContent(data, 'name')
      }
    }
  }
}

module.exports = AuthorTransformer
