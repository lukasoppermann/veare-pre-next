'use strict'

const Transformer = require('./Transformer')
const SectionTransformer = require('./SectionTransformer')
const striptags = require('striptags')

class ChapterTransformer extends Transformer {
  transform (data) {
    // abort if no header
    if (typeof data.fields !== 'object') {
      return null
    }
    // get plain text for readTime
    let plainText = new SectionTransformer(this.getContent(data, 'sections')).all()
      .flatMap(section => {
        if (section.fields.type === 'sectionCollection') {
          return section.fields.sections
        }
        return section
      })
      .map(section => {
        return striptags(`${section.fields.title || ''} ${section.fields.text || ''} ${section.fields.annotation || ''} ${section.fields.intro || ''}`)
      })
      .reduce((accumulator, current) => accumulator + current)

    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        title: this.getContent(data, 'title'),
        titleType: this.getContent(data, 'titleType', 'hidden'),
        slug: this.getContent(data, 'slug'),
        classes: this.getContent(data, 'classes'),
        sections: new SectionTransformer(this.getContent(data, 'sections')).all(),
        plainText: plainText
      }
    }
  }
}

module.exports = ChapterTransformer
