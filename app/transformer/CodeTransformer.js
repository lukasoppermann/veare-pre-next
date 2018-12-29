'use strict'

const Transformer = require('./Transformer')
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

class CodeTransformer extends Transformer {
  transform (data) {
    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        type: data.sys.contentType.sys.id,
        fileOrPath: this.getContent(data, 'fileOrPath'),
        code: highlightCode(this.getContent(data, 'code'), this.getContent(data, 'language', 'none').toLowerCase()),
        language: this.getContent(data, 'language', 'none').toLowerCase()
      }
    }
  }
}

module.exports = CodeTransformer
