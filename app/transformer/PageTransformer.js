'use strict'

const Transformer = require('./Transformer')
const HeaderTransformer = require('./HeaderTransformer')
const ChapterTransformer = require('./ChapterTransformer')
const CollectionTransformer = require('./CollectionTransformer')

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
        chapters: this.getContent(data, 'chapters').map((item) => {
          if (item.sys.contentType.sys.id === 'collection') {
            return new CollectionTransformer(item).first()
          } else if (item.sys.contentType.sys.id === 'chapter') {
            return new ChapterTransformer(item).first()
          }
        })
      }
    }
  }
}

module.exports = PageTransformer
