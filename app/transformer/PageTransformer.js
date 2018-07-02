'use strict'

const Transformer = require('./Transformer')
const ChapterTransformer = require('./ChapterTransformer')

class PageTransformer extends Transformer {
  transform (data) {
    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        slug: this.getContent(data, 'slug'),
        title: this.getContent(data, 'title'),
        customPageData: this.getContent(data, 'customPageData'),
        isHomepage: this.getContent(data, 'homepage', false),
        chapters: new ChapterTransformer(this.getContent(data, 'chapters')).get()
      }
    }
  }
}

module.exports = PageTransformer
