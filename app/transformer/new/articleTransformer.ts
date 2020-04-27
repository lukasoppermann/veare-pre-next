import { transformedDataInterface } from '../../../types/transformer'
import transformer, { getField } from './transformer'
import pictureElementTransformer from './pictureElementTransformer'
import richText from '../../services/newConvertRichText'
const readingTime = require('reading-time')

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
        featuredImage: (pictureElementTransformer(getField(data, 'featuredImage')))[0],
        rawdate: getField(data, 'date'),
        date: new Date(getField(data, 'date')).toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' }),
        preview: getField(data, 'preview'),
        content: content.html,
        readingTime: Math.ceil(readingTime(content.html).time / 60000),
        category: getField(data, 'category', 'design')
      }
    }
  })
}
