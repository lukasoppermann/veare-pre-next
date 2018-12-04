'use strict'

const Transformer = require('./Transformer')
const AssetTransformer = require('./AssetTransformer')
const PictureSourceTransformer = require('./PictureSourceTransformer')

class MediaResourceTransformer extends Transformer {
  transform (data) {
    let fn = this[data.sys.contentType.sys.id].bind(this)
    if (typeof fn === 'function') {
      return {
        id: data.sys.id,
        createdAt: data.sys.createdAt,
        updatedAt: data.sys.updatedAt,
        fields: fn(data)
      }
    }
    return null
  }
  // Picture Element
  pictureElement (data) {
    return {
      type: data.sys.contentType.sys.id,
      title: this.getContent(data, 'title'),
      image: new AssetTransformer(this.getContent(data, 'image')).first(),
      sources: new PictureSourceTransformer(this.getContent(data, 'pictureSources')).all()
    }
  }
}

module.exports = MediaResourceTransformer
