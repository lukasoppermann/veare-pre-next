'use strict'

const Transformer = require('./Transformer')
const ChapterTransformer = require('./ChapterTransformer')
const AssetTransformer = require('./AssetTransformer')

class ProjectTransformer extends Transformer {
  transform (data) {
    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        title: this.getContent(data, 'title'),
        published: this.getContent(data, 'published', true).toString(),
        subtitle: this.getContent(data, 'subtitle'),
        titleStyle: this.getContent(data, 'titleStyle', 'default'),
        slug: this.getContent(data, 'slug'),
        headerImage: new AssetTransformer(this.getContent(data, 'headerImage')).first(),
        previewImage: new AssetTransformer(this.getContent(data, 'previewImage')).first(),
        chapters: new ChapterTransformer(this.getContent(data, 'chapters')).all()
        // challenge: this.getContent(data, 'challenge'),
        // role: this.getContent(data, 'role'),
        // publicationYear: this.getContent(data, 'publicationYear'),
        // industry: this.getContent(data, 'industry'),
        // client: this.getContent(data, 'client'),
        // related:
        // tags:
      }
    }
  }
}

module.exports = ProjectTransformer
