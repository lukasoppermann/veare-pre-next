'use strict'

const Transformer = require('./Transformer')
const Category = require('../models/Category')
const CategoryTransformer = require('./CategoryTransformer')
const AssetTransformer = require('./AssetTransformer')
const readingTime = require('reading-time')
const convertMarkdown = require('../services/convertMarkdown')

const modifiers = {
  h1: {
    class: 'o-headline o-headline--h2 o-headline--serif'
  }
}

class PostTransformer extends Transformer {
  transform (data) {

    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        slug: this.getField('slug', data),
        title: this.getField('title', data),
        banner: new AssetTransformer(this.getField('banner', data)).first(),
        rawdate: this.getField('date', data),
        date: this.formatDate(this.getField('date', data)),
        preview: this.getField('preview', data),
        intro: this.getField('intro', data),
        firstParagraph: convertMarkdown(this.getField('firstParagraph', data), modifiers),
        content: convertMarkdown(this.getField('content', data), modifiers),
        readingTime: Math.ceil(readingTime(this.getField('content', data)).time / 60000),
        category: new Category(CategoryTransformer, 'category').find(this.getField('category', data).sys.id),
        author: null
      }
    }
  }
}

module.exports = PostTransformer
