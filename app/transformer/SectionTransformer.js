'use strict'

const Transformer = require('./Transformer')
const AssetTransformer = require('./AssetTransformer')

class SectionTransformer extends Transformer {
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

  textSection (data) {
    return {
      type: data.sys.contentType.sys.id,
      stylingOptions: this.getContent(data, 'stylingOptions', []),
      sectionTitle: this.getContent(data, 'sectionTitle'),
      intro: this.getContent(data, 'intro'),
      text: this.getContent(data, 'text')
    }
  }

  mediaSection (data) {
    return {
      type: data.sys.contentType.sys.id,
      stylingOptions: this.getContent(data, 'stylingOptions', []),
      sectionTitle: this.getContent(data, 'sectionTitle'),
      description: this.getContent(data, 'description'),
      media: new AssetTransformer(this.getContent(data, 'media')).get()
    }
  }

  quoteSection (data) {
    return {
      type: data.sys.contentType.sys.id,
      stylingOptions: this.getContent(data, 'stylingOptions', []),
      text: this.getContent(data, 'text'),
      author: this.getContent(data, 'author')
    }
  }
}

module.exports = SectionTransformer
