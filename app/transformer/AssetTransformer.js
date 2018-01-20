'use strict'

const Transformer = require('./Transformer')

class AssetTransformer extends Transformer {
  transform (data) {
    // return null if no asset
    if (data === undefined) return null
    // get file
    let file = data.fields['file']

    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        title: data.fields['title'],
        description: data.fields['description'],
        url: file.url,
        fileName: file.fileName,
        details: file.details,
        contentType: file.contentType
      }
    }
  }
}

module.exports = AssetTransformer
