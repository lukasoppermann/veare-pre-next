'use strict'

const Transformer = require('./Transformer')

class AssetTransformer extends Transformer {
  transform (data) {
    // // abort if no header
    // if (typeof data.fields !== 'object') {
    //   return null
    // }
    // get file
    let file = this.getContent(data, 'file')

    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        title: this.getContent(data, 'title'),
        description: this.getContent(data, 'description'),
        url: file.url,
        fileName: file.fileName,
        details: file.details,
        contentType: file.contentType
      }
    }
  }
}

module.exports = AssetTransformer
