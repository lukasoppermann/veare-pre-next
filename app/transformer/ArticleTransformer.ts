import convertRichText from '../services/convertRichText'

const Transformer = require('./Transformer')
const PictureElementTransformer = require('./PictureElementTransformer')
const readingTime = require('reading-time')

class ArticleTransformer extends Transformer {
  transform (data) {
    const content = convertRichText(this.getContent(data, 'content'))
    // calc reading time
    const readTime = Math.ceil(readingTime(content).time / 60000)

    // return
    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        type: data.sys.contentType.sys.id,
        slug: this.getContent(data, 'slug'),
        title: this.getContent(data, 'title'),
        featuredImage: new PictureElementTransformer(this.getContent(data, 'featuredImage')).first(),
        rawdate: this.getContent(data, 'date'),
        date: this.formatDate(this.getContent(data, 'date')),
        preview: this.getContent(data, 'preview'),
        content: content,
        readingTime: readTime,
        category: this.getContent(data, 'category', 'design')
      }
    }
  }
}

module.exports = ArticleTransformer
