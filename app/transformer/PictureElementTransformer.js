'use strict'

const Transformer = require('./Transformer')
const AssetTransformer = require('./AssetTransformer')
const PictureSourceTransformer = require('./PictureSourceTransformer')
const convertMarkdown = require('../services/convertMarkdown')

class PictureElementTransformer extends Transformer {
  transform (data) {
    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        type: data.sys.contentType.sys.id,
        title: this.getContent(data, 'title'),
        description: convertMarkdown(this.getContent(data, 'description')),
        image: new AssetTransformer(this.getContent(data, 'image')).first(),
        sources: new PictureSourceTransformer(this.getContent(data, 'pictureSources')).all()
      }
    }
  }
}

module.exports = PictureElementTransformer
