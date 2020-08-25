import { transformedArticleFields } from '../../types/transformer'
import transformer, { getField } from './transformer'
import richText from '../services/convertRichText'
const readingTime = require('reading-time')

export default async (data) => {
  return transformer(data, async (data) => {
    // transform richText
    const content = await richText(getField(data, 'content'), {
      picture: {
        loading: 'lazy',
        sourcesFunction: (picture) => [
          {
            fileType: 'image/webp',
            srcset: [500, 1000, 1400, 2000].map(size => `${picture.image.fields.url}?fm=webp&w=${size} ${size}w`).join(', '),
            sizes: '(min-width: 1400px) 1000px, (min-width: 1000px) 900px, (min-width: 768px) 700px, 100vw'
          }
        ]
      }
    })
    // return format
    return <transformedArticleFields>{
      slug: getField(data, 'slug'),
      title: getField(data, 'title'),
      rawLastIteration: getField(data, 'lastIteration'),
      lastIteration: new Date(getField(data, 'lastIteration')).toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' }),
      seoDescription: getField(data, 'seoDescription'),
      preview: getField(data, 'preview'),
      content: content.html,
      readingTime: Math.ceil(readingTime(content.html).time / 60000),
      category: getField(data, 'category', 'design'),
      relatedContent: getField(data, 'relatedContent', []).map(item => item.sys.id)
    }
  })
}
