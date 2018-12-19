'use strict'

const Transformer = require('./Transformer')

class BoxedContentSectionTransformer extends Transformer {
  transform (data) {
    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        type: data.sys.contentType.sys.id,
        title: this.getContent(data, 'title'),
        items: this.getContent(data, 'items')
      }
    }
  }
}

module.exports = BoxedContentSectionTransformer
