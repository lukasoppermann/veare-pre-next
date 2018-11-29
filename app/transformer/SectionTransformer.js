'use strict'

const Transformer = require('./Transformer')
const AssetTransformer = require('./AssetTransformer')
const MediaResourceTransformer = require('./MediaResourceTransformer')
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
      title: this.getContent(data, 'title'),
      titleType: this.getContent(data, 'titleType', 'hidden'),
      options: this.getContent(data, 'stylingOptions', []),
      intro: convertMarkdown(this.getContent(data, 'intro'), modifiers),
      text: convertMarkdown(this.getContent(data, 'text'), modifiers),
      annotation: convertMarkdown(this.getContent(data, 'annotation'), modifiers)
    }
  }

  mediaSection (data) {
    return {
      type: data.sys.contentType.sys.id,
      title: this.getContent(data, 'title'),
      titleType: this.getContent(data, 'titleType', 'hidden'),
      classes: this.getContent(data, 'classes'),
      descriptionTitle: this.getContent(data, 'descriptionTitle'),
      description: convertMarkdown(this.getContent(data, 'description'), modifiers),
      mediaResources: new MediaResourceTransformer(this.getContent(data, 'mediaResources')).get(),
      media: new AssetTransformer(this.getContent(data, 'media'), this.getContent(data, 'title')).get()
    }
  }

  quoteSection (data) {
    return {
      type: data.sys.contentType.sys.id,
      title: this.getContent(data, 'title'),
      titleType: this.getContent(data, 'titleType', 'hidden'),
      text: this.getContent(data, 'text'),
      author: this.getContent(data, 'author')
    }
  }

  boxedContentSection (data) {
    return {
      type: data.sys.contentType.sys.id,
      title: this.getContent(data, 'title'),
      items: this.getContent(data, 'items')
    }
  }

  sectionCollection (data) {
    return {
      type: data.sys.contentType.sys.id,
      title: this.getContent(data, 'title'),
      titleType: this.getContent(data, 'titleType', 'hidden'),
      sections: this.getContent(data, 'sections').map(section => {
        return this.transform(section)
      }),
      classes: this.getContent(data, 'classes')
    }
  }
}

module.exports = SectionTransformer
