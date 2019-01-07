'use strict'

const Transformer = require('./Transformer')
const ChapterTransformer = require('./ChapterTransformer')
const HeaderTransformer = require('./HeaderTransformer')

class PageTransformer extends Transformer {
  transform (data) {
    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        type: data.sys.contentType.sys.id,
        slug: this.getContent(data, 'slug'),
        title: this.getContent(data, 'title'),
        header: new HeaderTransformer(this.getContent(data, 'header')).first(),
        isHomepage: this.getContent(data, 'homepage', false),
        chapters: new ChapterTransformer(this.getContent(data, 'chapters')).all()
      }
    }
  }
}

module.exports = PageTransformer
