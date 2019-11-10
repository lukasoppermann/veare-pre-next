'use strict'

const Transformer = require('./Transformer')
const convertMarkdown = require('../services/convertMarkdown')

class ProjectInfoTransformer extends Transformer {
  transform (data) {
    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        type: data.sys.contentType.sys.id,
        items: this.getContent(data, 'facts'),
        tableOfContent: this.getContent(data, 'tableOfContent'),
        challenge: convertMarkdown(this.getContent(data, 'challenge'))
      }
    }
  }
}

module.exports = ProjectInfoTransformer
