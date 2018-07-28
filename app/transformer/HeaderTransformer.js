'use strict'

const Transformer = require('./Transformer')
const AssetTransformer = require('./AssetTransformer')

class HeaderTransformer extends Transformer {
  transform (data) {
    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        title: this.getContent(data, 'title'),
        image: new AssetTransformer(this.getContent(data, 'image')).first()
      }
    }
  }
}

module.exports = HeaderTransformer
