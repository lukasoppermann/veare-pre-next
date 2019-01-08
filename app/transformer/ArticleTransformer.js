'use strict'

const Transformer = require('./Transformer')
const Category = require('../models/Category')
const Author = require('../models/Author')
const PictureElementTransformer = require('./PictureElementTransformer')
const ChapterTransformer = require('./ChapterTransformer')
const readingTime = require('reading-time')

class ArticleTransformer extends Transformer {
  transform (data) {
    let chapters = new ChapterTransformer(this.getContent(data, 'chapters')).all()
    // calc reading time
    let readTime = Math.ceil(readingTime(chapters
      .reduce((text, current) => `${text} ${current.fields.plainText}`, '')).time / 60000)

    // return
    return {
      id: data.sys.id,
      contentType: data.sys.contentType.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        type: data.sys.contentType.sys.id,
        slug: this.getContent(data, 'slug'),
        title: this.getContent(data, 'title'),
        featuredImage: new PictureElementTransformer(this.getContent(data, 'featuredImage')).first(),
        rawdate: this.getContent(data, 'date'),
        date: this.formatDate(this.getContent(data, 'date')),
        preview: this.getContent(data, 'preview'),
        chapters: chapters,
        readingTime: readTime,
        category: new Category().find(this.getContent(data, 'category').sys.id),
        author: new Author().find(this.getContent(data, 'author').sys.id)
      }
    }
  }
}

module.exports = ArticleTransformer
