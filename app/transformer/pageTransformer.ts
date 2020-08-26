import { transformedPageFields } from '../../types/transformer'
import transformer, { getField } from './transformer'
import richText from '../services/convertRichText'

export default async (data) => {
  return transformer(data, async (data) => {
    // transform richText
    const content = await richText(getField(data, 'content'))
    // return format
    return <transformedPageFields>{
      slug: getField(data, 'slug'),
      title: getField(data, 'title'),
      rawLastIteration: getField(data, 'lastIteration'),
      lastIteration: new Date(getField(data, 'lastIteration')).toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' }),
      description: getField(data, 'description'),
      content: content.html
    }
  })
}
