'use strict'

const Transformer = require('./Transformer')
const AssetTransformer = require('./AssetTransformer')

class HeaderTransformer extends Transformer {
  transform (data) {
    // abort if no header
    if (typeof data.fields !== 'object') {
      return null
    }

    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        title: this.getContent(data, 'title'),
        logo: this.getContent(data, 'logo', 'hidden'),
        image: new AssetTransformer(this.getContent(data, 'image')).first()
      }
    }
  }
}

module.exports = HeaderTransformer
