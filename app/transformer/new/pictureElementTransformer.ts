import { transformedDataInterface } from '../../../types/transformer'
import transformer, { getField } from './transformer'
import assetTransformer from './assetTransformer'
import pictureSourceTransformer from './pictureSourceTransformer'

export default async (data) => {
  return transformer(data, async (data): Promise<transformedDataInterface> => {
    // return format
    return <transformedDataInterface>{
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        type: data.sys.contentType.sys.id,
        title: getField(data, 'title'),
        description: getField(data, 'description'),
        image: (await assetTransformer(getField(data, 'image')))[0],
        style: getField(data, 'style', 'center').toLowerCase().replace(' ', '-'),
        sources: await pictureSourceTransformer(getField(data, 'pictureSources')),
        classes: getField(data, 'cssClasses', []).join(' '),
        backgroundColor: getField(data, 'backgroundColor')
      }
    }
  })
}
