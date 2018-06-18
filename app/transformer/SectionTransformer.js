'use strict'

const Transformer = require('./Transformer')
const AssetTransformer = require('./AssetTransformer')
const convertMarkdown = require('../services/convertMarkdown')
let modifiers = {
  reset: true
}

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
      title: this.getContent(data, 'title'),
      showTitle: this.getContent(data, 'showTitle'),
      intro: this.getContent(data, 'intro'),
      text: convertMarkdown(this.getContent(data, 'text'), modifiers)
    }
  }

  mediaSection (data) {
    return {
      type: data.sys.contentType.sys.id,
      title: this.getContent(data, 'title'),
      showTitle: this.getContent(data, 'showTitle'),
      classes: this.getContent(data, 'classes'),
      stylingOptions: this.getContent(data, 'stylingOptions', []),
      description: this.getContent(data, 'description'),
      media: new AssetTransformer(this.getContent(data, 'media')).get()
    }
  }

  mediaCollectionSection (data) {
    return {
      type: data.sys.contentType.sys.id,
      title: this.getContent(data, 'title'),
      showTitle: this.getContent(data, 'showTitle'),
      slug: this.getContent(data, 'slug'),
      description: this.getContent(data, 'description'),
      media: new AssetTransformer(this.getContent(data, 'media')).get()
    }
  }

  quoteSection (data) {
    return {
      type: data.sys.contentType.sys.id,
      title: this.getContent(data, 'title'),
      showTitle: this.getContent(data, 'showTitle'),
      stylingOptions: this.getContent(data, 'stylingOptions', []),
      text: this.getContent(data, 'text'),
      author: this.getContent(data, 'author')
    }
  }
}

module.exports = SectionTransformer
