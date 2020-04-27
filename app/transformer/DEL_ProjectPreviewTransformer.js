'use strict'

const Transformer = require('./Transformer')
const AssetTransformer = require('./AssetTransformer')
const PictureElementTransformer = require('./PictureElementTransformer')

class ProjectTransformer extends Transformer {
  transform (data) {
    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        type: data.sys.contentType.sys.id,
        title: this.getContent(data, 'title'),
        subtitle: this.getContent(data, 'subtitle'),
        titleStyle: this.getContent(data, 'titleStyle', 'default'),
        slug: this.getContent(data, 'slug'),
        toc: this.getContent(data, 'tableOfContent', false),
        header: new PictureElementTransformer(this.getContent(data, 'header')).first(),
        previewImage: new AssetTransformer(this.getContent(data, 'previewImage')).first(),
        variables: this.getContent(data, 'variables', []).reduce(
          (obj, item) => Object.assign(obj, { [item.key]: item.value }), {}
        )
      }
    }
  }
}

module.exports = ProjectTransformer
