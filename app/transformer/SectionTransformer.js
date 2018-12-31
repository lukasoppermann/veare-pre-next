'use strict'

const Transformer = require('./Transformer')
const Transform = {
  textSection: require('./TextSectionTransformer'),
  code: require('./CodeTransformer'),
  dynamicContent: require('./DynamicContentTransformer'),
  pictureElement: require('./PictureElementTransformer'),
  boxedContentSection: require('./BoxedContentSectionTransformer')
}

class SectionTransformer extends Transformer {
  transform (data) {
    let sections = {
      items: [data]
    }
    // overwrite if collection already
    if (data.sys.contentType.sys.id === 'section') {
      sections = {
        items: this.getContent(data, 'sections'),
        classes: (this.getContent(data, 'classes') || []).join(' ')
      }
    }
    // transform items
    sections.items = sections.items.map(section => {
      return new Transform[section.sys.contentType.sys.id](section).first()
    })

    return sections
  }
}

module.exports = SectionTransformer
