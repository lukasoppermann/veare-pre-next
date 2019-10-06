'use strict'

const Transformer = require('./Transformer')
import hljs = require('highlight.js')

class CodeTransformer extends Transformer {
  transform (data) {
    const programmingLanguage = this.getContent(data, 'language', 'none').toLowerCase()

    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        type: data.sys.contentType.sys.id,
        fileOrPath: this.getContent(data, 'fileOrPath'),
        code: hljs.highlight(programmingLanguage, this.getContent(data, 'code')).value,
        language: programmingLanguage
      }
    }
  }
}

module.exports = CodeTransformer
