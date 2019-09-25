'use strict'

const Transformer = require('./Transformer')

class DynamicContentTransformer extends Transformer {
  transform (data) {
    const type = this.getContent(data, 'type').toLowerCase()
    const value = this.getContent(data, 'variable')

    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        type: data.sys.contentType.sys.id,
        variableType: type,
        variable: value
      }
    }
  }
}

module.exports = DynamicContentTransformer
