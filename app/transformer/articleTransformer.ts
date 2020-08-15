import { transformedDataInterface } from '../../types/transformer'
import transformer, { getField } from './transformer'
import richText from '../services/convertRichText'
const readingTime = require('reading-time')

export default async (data) => {
  return transformer(data, async (data): Promise<transformedDataInterface> => {
    // transform richText
    const content = await richText(getField(data, 'content'), {
      picture: {
        loading: 'lazy',
        sourcesFunction: (picture) => [
          {
            type: 'image/webp',
            srcset: [500, 1000, 1400, 2000].map(size => `${picture.image.fields.url}?fm=webp&w=${size} ${size}w`).join(', '),
            sizes: '(min-width: 1400px) 1000px, (min-width: 1000px) 900px, (min-width: 768px) 700px, 100vw'
          }
        ]
      }
    })
    // return format
    return <transformedDataInterface>{
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      contentType: data.sys.contentType.sys.id,
      publishedVersions: data.sys.revision,
      fields: {
        slug: getField(data, 'slug'),
        title: getField(data, 'title'),
        rawLastIteration: getField(data, 'lastIteration'),
        lastIteration: new Date(getField(data, 'lastIteration')).toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' }),
        preview: getField(data, 'preview'),
        content: content.html,
        readingTime: Math.ceil(readingTime(content.html).time / 60000),
        category: getField(data, 'category', 'design'),
        relatedContent: getField(data, 'relatedContent', []).map(item => item.sys.id)
      }
    }
  })
}
