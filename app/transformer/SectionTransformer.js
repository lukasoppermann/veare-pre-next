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
      showTitle: this.getContent(data, 'showTitle', true),
      intro: this.getContent(data, 'intro'),
      text: convertMarkdown(this.getContent(data, 'text'), modifiers),
      annotation: this.getContent(data, 'annotation')
    }
  }

  mediaSection (data) {
    return {
      type: data.sys.contentType.sys.id,
      title: this.getContent(data, 'title'),
      showTitle: this.getContent(data, 'showTitle', true),
      classes: this.getContent(data, 'classes'),
      stylingOptions: this.getContent(data, 'stylingOptions', []),
      description: this.getContent(data, 'description'),
      media: new AssetTransformer(this.getContent(data, 'media'), this.getContent(data, 'title')).get()
    }
  }

  mediaCollectionSection (data) {
    return {
      type: data.sys.contentType.sys.id,
      title: this.getContent(data, 'title'),
      showTitle: this.getContent(data, 'showTitle', true),
      slug: this.getContent(data, 'slug'),
      descriptionTitle: this.getContent(data, 'descriptionTitle'),
      description: this.getContent(data, 'description'),
      media: new AssetTransformer(this.getContent(data, 'media'), this.getContent(data, 'title')).get(),
      classes: this.getContent(data, 'classes')
    }
  }

  quoteSection (data) {
    return {
      type: data.sys.contentType.sys.id,
      title: this.getContent(data, 'title'),
      showTitle: this.getContent(data, 'showTitle', true),
      stylingOptions: this.getContent(data, 'stylingOptions', []),
      text: this.getContent(data, 'text'),
      author: this.getContent(data, 'author')
    }
  }
}

module.exports = SectionTransformer
