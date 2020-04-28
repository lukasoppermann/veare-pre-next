import { transformedDataInterface } from '../../../types/transformer'
import transformer, { getField } from './transformer'
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
      contentType: data.sys.contentType.sys.id,
      fields: {
        slug: getField(data, 'slug'),
        title: getField(data, 'title'),
        content: content.html
      }
    }
  })
}
