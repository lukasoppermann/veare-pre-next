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
    let sections = new SectionTransformer(this.getContent(data, 'sections')).all()
    let plainText = ''
    // sections
    //   .flatMap(section => {
    //     return section.items
    //   })
    //   .map(section => {
    //     return striptags(`${section.fields.title || ''} ${section.fields.text || ''}`)
    //   })
    //   .reduce((accumulator, current) => accumulator + current)

    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        title: this.getContent(data, 'title'),
        titleType: this.getContent(data, 'titleType', 'hidden'),
        slug: this.getContent(data, 'slug'),
        classes: this.getContent(data, 'classes'),
        sections: sections,
        plainText: plainText
      }
    }
  }
}

module.exports = ChapterTransformer
