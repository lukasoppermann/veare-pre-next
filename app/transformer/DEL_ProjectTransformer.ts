'use strict'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'

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
        slug: this.getContent(data, 'slug'),
        durationStart: this.getContent(data, 'durationStart'),
        durationEnd: this.getContent(data, 'durationEnd'),
        year: new Date(this.getContent(data, 'durationStart')).getFullYear(),
        client: this.getContent(data, 'client'),
        challenge: documentToHtmlString(this.getContent(data, 'challenge')),
        roleAndTeam: documentToHtmlString(this.getContent(data, 'roleAndTeam')),
        header: new PictureElementTransformer(this.getContent(data, 'header')).first(),
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
