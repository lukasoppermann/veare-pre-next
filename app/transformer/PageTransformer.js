'use strict'

const Transformer = require('./Transformer')
const SectionTransformer = require('./SectionTransformer')

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
        sections: new SectionTransformer(this.getContent(data, 'sections')).get()
      }
    }
  }
}

module.exports = PageTransformer
