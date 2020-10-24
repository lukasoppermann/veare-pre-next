import { transformedPageFields } from '../../types/transformer'
import transformer, { getField } from './transformer'
import richText from '../services/convertRichText'
/**
 * @function getEmbeddedBlocks
 * @param {array} content
 */
const getEmbeddedBlocks = (content: any[]) => {
  return content
    .filter(item => item.nodeType === 'embedded-entry-block' &&
      ['block', 'picture'].includes(item.data.target.sys.contentType.sys.id)
    ).map(item => ({
      contentType: item.data.target.sys.contentType.sys.id,
      id: item.data.target.sys.id
    }))
}
/**
 * Page Transformer
 */
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
      content: content.html,
      embeddedBlocks: getEmbeddedBlocks(getField(data, 'content').content)
    }
  })
}
