'use strict'

const Transformer = require('./Transformer')
const Transformers = {
  project: require('./ProjectPreviewTransformer'),
  article: require('./ArticleTransformer'),
  link: require('./LinkTransformer')
}

class CollectionTransformer extends Transformer {
  transform (data) {
    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        type: data.sys.contentType.sys.id,
        items: this.getContent(data, 'items').map(item => {
          return new Transformers[item.sys.contentType.sys.id](item).first()
        }),
        classes: (this.getContent(data, 'classes') || []).join(' '),
        variables: this.getContent(data, 'variables', []).reduce(
          (obj, item) => Object.assign(obj, { [item.key]: item.value }), {}
        )
      }
    }
  }
}

module.exports = CollectionTransformer
