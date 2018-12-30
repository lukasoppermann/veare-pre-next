'use strict'

const Transformer = require('./Transformer')
const Category = require('../models/Category')
const Author = require('../models/Author')
const AssetTransformer = require('./AssetTransformer')
const readingTime = require('reading-time')
const convertMarkdown = require('../services/convertMarkdown')
const Prism = require('prismjs')
const Normalizer = require('prismjs/plugins/normalize-whitespace/prism-normalize-whitespace')
const loadLanguages = require('prismjs/components/')
loadLanguages(['yaml', 'php', 'markdown', 'bash', 'nginx', 'git', 'json'])
let normalizer = new Normalizer({
  'remove-trailing': true,
  'remove-indent': true,
  'left-trim': true,
  'right-trim': true,
  'tabs-to-spaces': 4
})

let highlightCode = (code, language = 'javascript') => {
  code = normalizer.normalize(code)
  return Prism.highlight(code, Prism.languages[language], language)
}

const modifiers = {
  figure: {
    class: 'o-figure c-article__figure'
  },
  figcaption: {
    class: 'o-figure__caption'
  },
  img: {
    class: 'o-figure__img'
  },
  code: {
    istype: 'fence',
    fn: (token) => {
      if (token.info === '') {
        token.info = 'bash'
      }
      token.content = highlightCode(token.content, token.info)
    }
  }
}

class PostTransformer extends Transformer {
  transform (data) {
    return {
      id: data.sys.id,
      contentType: data.sys.contentType.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        slug: this.getContent(data, 'slug'),
        title: this.getContent(data, 'title'),
        banner: new AssetTransformer(this.getContent(data, 'banner')).first(),
        rawdate: this.getContent(data, 'date'),
        date: this.formatDate(this.getContent(data, 'date')),
        preview: this.getContent(data, 'preview'),
        intro: convertMarkdown(this.getContent(data, 'intro'), modifiers),
        content: convertMarkdown(this.getContent(data, 'content'), modifiers),
        readingTime: Math.ceil(readingTime(this.getContent(data, 'content') || '').time / 60000),
        category: new Category().find(this.getContent(data, 'category').sys.id),
        author: new Author().find(this.getContent(data, 'author').sys.id),
        aliases: this.getContent(data, 'aliases')
      }
    }
  }
}

module.exports = PostTransformer
