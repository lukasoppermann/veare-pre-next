import { transformedDataInterface } from '../../../types/transformer'
import { default as transformer, getField } from './transformer'

import richText from '../../services/newConvertRichText'

export default async (data) => {
  return transformer(data, async (data): Promise<transformedDataInterface> => {
    // return format
    return <transformedDataInterface>{
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        type: data.sys.contentType.sys.id,
        slug: getField(data, 'slug'),
        title: getField(data, 'title'),
        subtitle: getField(data, 'subtitle'),
        durationStart: getField(data, 'durationStart'),
        durationEnd: getField(data, 'durationEnd'),
        year: new Date(getField(data, 'durationStart')).getFullYear(),
        client: getField(data, 'client'),
        challenge: await richText(getField(data, 'challenge')),
        roleAndTeam: await richText(getField(data, 'roleAndTeam')),
        // header: new PictureElementTransformer(this.getContent(data, 'header')).first(),
        // previewImage: new AssetTransformer(this.getContent(data, 'previewImage')).first(),
        // chapters: new ChapterTransformer(this.getContent(data, 'chapters')).all(),
        variables: getField(data, 'variables', []).reduce(
          (obj, item) => Object.assign(obj, { [item.key]: item.value }), {}
        )
      }
    }
  })
}

// type: data.sys.contentType.sys.id,
// title: this.getContent(data, 'title'),
// subtitle: this.getContent(data, 'subtitle'),
// slug: this.getContent(data, 'slug'),
// durationStart: this.getContent(data, 'durationStart'),
// durationEnd: this.getContent(data, 'durationEnd'),
// year: new Date(this.getContent(data, 'durationStart')).getFullYear(),
// client: this.getContent(data, 'client'),
// challenge: documentToHtmlString(this.getContent(data, 'challenge')),
// roleAndTeam: documentToHtmlString(this.getContent(data, 'roleAndTeam')),
// header: new PictureElementTransformer(this.getContent(data, 'header')).first(),
// previewImage: new AssetTransformer(this.getContent(data, 'previewImage')).first(),
// chapters: new ChapterTransformer(this.getContent(data, 'chapters')).all(),
// variables: this.getContent(data, 'variables', []).reduce(
//   (obj, item) => Object.assign(obj, { [item.key]: item.value }), {}
// )
