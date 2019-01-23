'use strict'

const Transformer = require('./Transformer')
const SectionTransformer = require('./SectionTransformer')
const striptags = require('striptags')

class ChapterTransformer extends Transformer {
  transform (data) {
    // get sections
    let sections = new SectionTransformer(this.getContent(data, 'sections')).all().filter(section => section !== null)
    // get plain text for readTime
    let plainText = ''
    if (sections.length > 0) {
      plainText = sections
        .flatMap(section => section.items)
        .map(section => striptags(`${section.fields.title || ''} ${section.fields.text || ''}`))
        .reduce((accumulator, current) => accumulator + current, '')
    }

    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        type: data.sys.contentType.sys.id,
        title: this.getContent(data, 'title'),
        titleType: this.getContent(data, 'titleType', 'hidden'),
        slug: this.getContent(data, 'slug'),
        classes: (this.getContent(data, 'classes') || []).join(' '),
        sections: sections,
        plainText: plainText
      }
    }
  }
}

module.exports = ChapterTransformer
