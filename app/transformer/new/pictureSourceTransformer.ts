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
      fields: {
        type: data.sys.contentType.sys.id,
        mediaQuery: getField(data, 'mediaQuery'),
        resolution: getField(data, 'resolution'),
        image: (await assetTransformer(getField(data, 'image')))[0]
      }
    }
  })
}
