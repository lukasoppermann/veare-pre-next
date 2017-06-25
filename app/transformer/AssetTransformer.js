'use strict'

const Transformer = require('./Transformer')

class AssetTransformer extends Transformer {
  transform (data) {
    // return null if no asset
    if (data === null) return null
    // get file
    let file = this.getField('file', data)

    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        title: this.getField('title', data),
        description: this.getField('description', data),
        url: file.url,
        fileName: file.fileName,
        details: file.details,
        contentType: file.contentType
      }
    }
  }
}

module.exports = AssetTransformer
