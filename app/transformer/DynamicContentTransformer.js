'use strict'

const Transformer = require('./Transformer')

class DynamicContentTransformer extends Transformer {
  transform (data) {
    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        type: data.sys.contentType.sys.id,
        variable: this.getContent(data, 'variable')
      }
    }
  }
}

module.exports = DynamicContentTransformer
