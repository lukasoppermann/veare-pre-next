'use strict'

const Transformer = require('./Transformer')
const Category = require('../models/Category')
const Author = require('../models/Author')
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
        slug: data.fields['slug'],
        title: data.fields['title'],
        banner: new AssetTransformer(data.fields['banner']).first(),
        rawdate: data.fields['date'],
        date: this.formatDate(data.fields['date']),
        preview: data.fields['preview'],
        intro: convertMarkdown(data.fields['intro'], modifiers),
        content: convertMarkdown(data.fields['content'], modifiers),
        readingTime: Math.ceil(readingTime(data.fields['content']).time / 60000),
        category: new Category().find(data.fields['category'].sys.id),
        author: new Author().find(data.fields['author'].sys.id),
        aliases: data.fields['aliases']
      }
    }
  }
}

module.exports = PostTransformer
