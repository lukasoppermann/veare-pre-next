'use strict'

const Transformer = require('./Transformer')

class PostTransformer extends Transformer {
  transform (data) {
    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      slug: this.getField('slug', data),
      // category: this.getLinkedField('category', 'slug', data),
      fields: {
        title: this.getField('title', data),
        date: this.formatDate(this.getField('date', data)),
        preview: this.getField('preview', data),
        content: this.getField('content', data)
        // category: this.getLinkedObject('category', data),
      }
    }
  }
}

module.exports = PostTransformer
