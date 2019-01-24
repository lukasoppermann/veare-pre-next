'use strict'

const Transformer = require('./Transformer')
const AssetTransformer = require('./AssetTransformer')

class HeaderTransformer extends Transformer {
  transform (data) {
    // console.log(require('util').inspect(this.getContent(data, 'test'), false, null, true))
    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        type: data.sys.contentType.sys.id,
        title: this.getContent(data, 'title'),
        logo: this.getContent(data, 'logo', 'hidden'),
        image: new AssetTransformer(this.getContent(data, 'image')).first()
      }
    }
  }
}

module.exports = HeaderTransformer
