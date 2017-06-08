'use strict'

const Transformer = require('./Transformer')
const Category = require('../models/Category')
let self

class PostTransformer extends Transformer {
  constructor (data) {
    super(data)
    self = this
  }

  transform (data) {
    console.log(this.getField('category', data));
    let categoryId = this.getField('category', data).sys.id
    new Category().find(categoryId, (category) => {
      return {
        id: data.sys.id,
        createdAt: data.sys.createdAt,
        updatedAt: data.sys.updatedAt,
        fields: {
          slug: self.getField('slug', data),
          title: self.getField('title', data),
          rawdate: self.getField('date', data),
          date: self.formatDate(self.getField('date', data)),
          preview: self.getField('preview', data),
          content: self.getField('content', data),
          category: category
        }
      }
    })
  }
}

module.exports = PostTransformer
