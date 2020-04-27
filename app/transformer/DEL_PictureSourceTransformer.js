'use strict'

const Transformer = require('./Transformer')
const AssetTransformer = require('./AssetTransformer')

class PictureSourceTransformer extends Transformer {
  transform (data) {
    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        type: data.sys.contentType.sys.id,
        mediaQuery: this.getContent(data, 'mediaQuery'),
        resolution: this.getContent(data, 'resolution'),
        image: new AssetTransformer(this.getContent(data, 'image')).first()
      }
    }
  }
}

module.exports = PictureSourceTransformer
