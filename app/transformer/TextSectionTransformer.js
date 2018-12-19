'use strict'

const Transformer = require('./Transformer')
const convertMarkdown = require('../services/convertMarkdown')
let modifiers = {
  reset: true
}

class TextSectionTransformer extends Transformer {
  transform (data) {
    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        type: data.sys.contentType.sys.id,
        title: this.getContent(data, 'title'),
        titleType: this.getContent(data, 'titleType', 'hidden'),
        options: this.getContent(data, 'stylingOptions', []),
        intro: convertMarkdown(this.getContent(data, 'intro'), modifiers),
        text: convertMarkdown(this.getContent(data, 'text'), modifiers),
        textType: this.getContent(data, 'textType', 'text').toLowerCase()
      }
    }
  }
}

module.exports = TextSectionTransformer
