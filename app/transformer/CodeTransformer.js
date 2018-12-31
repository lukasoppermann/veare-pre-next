'use strict'

const Transformer = require('./Transformer')
const syntaxHighlight = require('../services/syntaxHighlight')

class CodeTransformer extends Transformer {
  transform (data) {
    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        type: data.sys.contentType.sys.id,
        fileOrPath: this.getContent(data, 'fileOrPath'),
        code: syntaxHighlight(this.getContent(data, 'code'), this.getContent(data, 'language', 'none').toLowerCase()),
        language: this.getContent(data, 'language', 'none').toLowerCase()
      }
    }
  }
}

module.exports = CodeTransformer
