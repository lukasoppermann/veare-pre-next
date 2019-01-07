'use strict'

const Transformer = require('./Transformer')
const ChapterTransformer = require('./ChapterTransformer')
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
        header: new PictureElementTransformer(this.getContent(data, 'header')).first(),
        headerImage: new AssetTransformer(this.getContent(data, 'headerImage')).first(),
        previewImage: new AssetTransformer(this.getContent(data, 'previewImage')).first(),
        chapters: new ChapterTransformer(this.getContent(data, 'chapters')).all(),
        variables: this.getContent(data, 'variables', []).reduce(
          (obj, item) => Object.assign(obj, { [item.key]: item.value }), {}
        )
      }
    }
  }
}

module.exports = ProjectTransformer
