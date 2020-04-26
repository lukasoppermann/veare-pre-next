import { transformedDataInterface } from '../../../types/transformer'
import transformer, { getField } from './transformer'
import assetTransformer from './assetTransformer'
import pictureElementTransformer from './pictureElementTransformer'
import richText from '../../services/newConvertRichText'

export default async (data) => {
  return transformer(data, async (data): Promise<transformedDataInterface> => {
    // transform richText
    const content = await richText(getField(data, 'content'))
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
        challenge: (await richText(getField(data, 'challenge'))).html,
        roleAndTeam: (await richText(getField(data, 'roleAndTeam'))).html,
        header: (await pictureElementTransformer(getField(data, 'header')))[0],
        previewImage: (await assetTransformer(getField(data, 'previewImage')))[0],
        content: content.html,
        anchors: content.anchors,
        variables: getField(data, 'variables', []).reduce(
          (obj, item) => Object.assign(obj, { [item.key]: item.value }), {}
        )
      }
    }
  })
}
