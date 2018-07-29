'use strict'

const Transformer = require('./Transformer')
const SectionTransformer = require('./SectionTransformer')

class ChapterTransformer extends Transformer {
  transform (data) {
    // abort if no header
    if (typeof data.fields !== 'object') {
      return null
    }
    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        title: this.getContent(data, 'title'),
        titleType: this.getContent(data, 'titleType', 'hidden'),
        slug: this.getContent(data, 'slug'),
        classes: this.getContent(data, 'classes'),
        sections: new SectionTransformer(this.getContent(data, 'sections')).get()
      }
    }
  }
}

module.exports = ChapterTransformer
