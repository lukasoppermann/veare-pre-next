import { transformedDataInterface } from '../../types/transformer'
import transformer, { getField } from './transformer'
// import pictureTransformer from './pictureTransformer'
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
            srcset: [500, 1000, 1400, 2000].map(size => `${picture.fields.image.fields.url}?fm=webp&w=${size} ${size}w`).join(', '),
            sizes: '(min-width: 1200px) 1000px, (min-width: 577px) 700px, 500px'
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
        // featuredImage: (await pictureTransformer(getField(data, 'featuredImage')))[0],
        rawLastIteration: getField(data, 'lastIteration'),
        lastIteration: new Date(getField(data, 'lastIteration')).toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' }),
        preview: getField(data, 'preview'),
        content: content.html,
        readingTime: Math.ceil(readingTime(content.html).time / 60000),
        category: getField(data, 'category', 'design')
      }
    }
  })
}
