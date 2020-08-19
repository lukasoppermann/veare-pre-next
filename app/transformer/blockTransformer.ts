import { transformedBlockFields } from '../../types/transformer'
import transformer, { getField } from './transformer'
import richText from '../services/convertRichText'

export default async (data) => {
  return transformer(data, async (data) => {
    // return format
    return <transformedBlockFields>{
      slug: getField(data, 'slug'),
      classes: getField(data, 'classes', []).join(' '),
      content: (await richText(getField(data, 'content'))).html
    }
  })
}
