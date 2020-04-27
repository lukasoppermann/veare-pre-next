// import convertRichText from '../services/convertRichText'
const convertMarkdown = require('../services/convertMarkdown')
const Transformer = require('./Transformer')

class TextSectionTransformer extends Transformer {
  transform (data) {
    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        type: data.sys.contentType.sys.id,
        text: convertMarkdown(this.getContent(data, 'text')),
        textType: this.getContent(data, 'textType', 'text').toLowerCase()
      }
    }
  }
}

module.exports = TextSectionTransformer
