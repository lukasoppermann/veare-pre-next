'use strict'

const Transformer = require('./Transformer')
const AssetTransformer = require('./AssetTransformer')
const MediaResourceTransformer = require('./MediaResourceTransformer')
const convertMarkdown = require('../services/convertMarkdown')
let modifiers = {
  reset: true
}

class MediaSectionTransformer extends Transformer {
  transform (data) {
    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        type: data.sys.contentType.sys.id,
        title: this.getContent(data, 'title'),
        titleType: this.getContent(data, 'titleType', 'hidden'),
        classes: this.getContent(data, 'classes'),
        description: convertMarkdown(this.getContent(data, 'description'), modifiers),
        mediaResources: new MediaResourceTransformer(this.getContent(data, 'mediaResources')).all(),
        media: new AssetTransformer(this.getContent(data, 'media'), this.getContent(data, 'title')).first() // should be removes
      }
    }
  }
}

module.exports = MediaSectionTransformer
