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
        items: this.getContent(data, 'items').map(item => {
          item.grow = item.type.replace('Size ', '')
          return item
        })
      }
    }
  }
}

module.exports = BoxedContentSectionTransformer
