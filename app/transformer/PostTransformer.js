'use strict'

const Transformer = require('./Transformer')
const Category = require('../models/Category')

class PostTransformer extends Transformer {
  transform (data) {
    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        slug: this.getField('slug', data),
        title: this.getField('title', data),
        rawdate: this.getField('date', data),
        date: this.formatDate(this.getField('date', data)),
        preview: this.getField('preview', data),
        content: this.getField('content', data),
        // category: new Category(this.getField('category', data)).transform()
        category: {
          slug: 'design',
          fields: {
            title: 'Design'
          }
        }
      }
    }
  }
}

module.exports = PostTransformer
