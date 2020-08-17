import { transformedFields } from '../../types/transformer'
import transformer, { getField } from './transformer'
import richText from '../services/convertRichText'

export default async (data) => {
  return transformer(data, async (data) => {
    // transform richText
    const content = await richText(getField(data, 'content'))
    // return format
    return <transformedFields>{
      slug: getField(data, 'slug'),
      title: getField(data, 'title'),
      content: content.html
    }
  })
}
