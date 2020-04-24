'use strict'

const Transformer = require('./Transformer')
const PictureElementTransformer = require('./PictureElementTransformer')

class ArticleTransformer extends Transformer {
  transform (data) {
    // return
    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        type: data.sys.contentType.sys.id,
        title: this.getContent(data, 'title'),
        subtitle: this.getContent(data, 'subtitle'),
        link: this.getContent(data, 'link'),
        target: this.getContent(data, 'targetBlank') ? '_blank' : '_self',
        picture: new PictureElementTransformer(this.getContent(data, 'picture')).first(),
        cssClasses: this.getContent(data, 'cssClasses')
      }
    }
  }
}

module.exports = ArticleTransformer
