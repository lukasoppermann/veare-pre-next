import { transformedDataInterface } from '../../../types/transformer'
import { default as transformer, getField } from './transformer'

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
        content: content
      }
    }
  })
}
