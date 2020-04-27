import { transformedDataInterface } from '../../../types/transformer'
import transformer, { getField } from './transformer'
import assetTransformer from './assetTransformer'

export default async (data) => {
  return transformer(data, async (data): Promise<transformedDataInterface> => {
    // return format
    return <transformedDataInterface>{
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      contentType: data.sys.contentType.sys.id,
      fields: {
        title: getField(data, 'title'),
        description: getField(data, 'description'),
        image: (await assetTransformer(getField(data, 'image')))[0],
        style: getField(data, 'style', 'center').toLowerCase().replace(' ', '-'),
        sources: [],
        classes: getField(data, 'cssClasses', []).join(' ')
      }
    }
  })
}
