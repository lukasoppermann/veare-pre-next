'use strict'

const Transformer = require('./Transformer')
const SectionTransformer = require('./SectionTransformer')
const AssetTransformer = require('./AssetTransformer')

class ProjectTransformer extends Transformer {
  transform (data) {
    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        title: this.getContent(data, 'title'),
        subtitle: this.getContent(data, 'subtitle'),
        titleStyle: this.getContent(data, 'titleStyle', 'default'),
        slug: this.getContent(data, 'slug'),
        headerImage: new AssetTransformer(this.getContent(data, 'headerImage')).first(),
        challenge: this.getContent(data, 'challenge'),
        role: this.getContent(data, 'role'),
        publicationYear: this.getContent(data, 'publicationYear'),
        industry: this.getContent(data, 'industry'),
        client: this.getContent(data, 'client'),
        sections: new SectionTransformer(this.getContent(data, 'sections')).get()
        // related:
        // tags:
      }
    }
  }
}

module.exports = ProjectTransformer
