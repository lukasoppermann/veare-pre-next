'use strict'

const Transformer = require('./Transformer')
const AssetTransformer = require('./AssetTransformer')
const PictureSourceTransformer = require('./PictureSourceTransformer')

class PictureElementTransformer extends Transformer {
  transform (data) {
    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        type: data.sys.contentType.sys.id,
        title: this.getContent(data, 'title'),
        description: this.getContent(data, 'description'),
        image: new AssetTransformer(this.getContent(data, 'image')).first(),
        style: this.getContent(data, 'style', 'center').toLowerCase().replace(' ', '-'),
        sources: new PictureSourceTransformer(this.getContent(data, 'pictureSources')).all(),
        classes: (this.getContent(data, 'classes') || []).join(' '),
        backgroundColor: this.getContent(data, 'backgroundColor')
      }
    }
  }
}

module.exports = PictureElementTransformer
