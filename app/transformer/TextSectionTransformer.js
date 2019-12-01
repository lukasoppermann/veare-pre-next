// import convertRichText from '../services/convertRichText'
import convertMarkdown from '../services/convertMarkdown'
const Transformer = require('./Transformer')

class TextSectionTransformer extends Transformer {
  transform (data) {
    console.log(data, this.getContent(data, 'newChallenge', ''))
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
