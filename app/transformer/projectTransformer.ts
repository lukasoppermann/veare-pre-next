import { transformedDataInterface } from '../../types/transformer'
import transformer, { getField } from './transformer'
import assetTransformer from './assetTransformer'
import pictureTransformer from './pictureTransformer'
import richText from '../services/convertRichText'

export default async (data) => {
  return transformer(data, async (data): Promise<transformedDataInterface> => {
    // transform richText
    const content = await richText(getField(data, 'content'))
    // return format
    return <transformedDataInterface>{
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      contentType: data.sys.contentType.sys.id,
      fields: {
        slug: getField(data, 'slug'),
        title: getField(data, 'title'),
        subtitle: getField(data, 'subtitle'),
        durationStart: getField(data, 'durationStart'),
        durationEnd: getField(data, 'durationEnd'),
        year: new Date(getField(data, 'durationStart')).getFullYear(),
        client: getField(data, 'client'),
        challenge: (await richText(getField(data, 'challenge'))).html,
        solution: (await richText(getField(data, 'solution'))).html,
        results: (await richText(getField(data, 'results'))).html,
        responsibilities: getField(data, 'responsibilities', ''),
        team: (await richText(getField(data, 'team'))).html,
        roleAndTeam: (await richText(getField(data, 'roleAndTeam'))).html,
        header: (await pictureTransformer(getField(data, 'header')))[0],
        previewImage: (await assetTransformer(getField(data, 'previewImage')))[0],
        content: content.html,
        anchors: content.anchors
      }
    }
  })
}
