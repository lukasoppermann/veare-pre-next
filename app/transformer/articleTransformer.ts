import { transformedDataInterface } from '../../types/transformer'
import transformer, { getField } from './transformer'
// import pictureTransformer from './pictureTransformer'
import richText from '../services/convertRichText'
const readingTime = require('reading-time')

export default async (data) => {
  return transformer(data, async (data): Promise<transformedDataInterface> => {
    // transform richText
    const content = await richText(getField(data, 'content'))
    console.debug(data.sys)
    // return format
    return <transformedDataInterface>{
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      firstPublishedAt: data.sys.firstPublishedAt,
      updatedAt: data.sys.updatedAt,
      publishedAt: data.sys.publishedAt,
      contentType: data.sys.contentType.sys.id,
      publishedVersions: data.sys.publishedCounter,
      fields: {
        slug: getField(data, 'slug'),
        title: getField(data, 'title'),
        // featuredImage: (await pictureTransformer(getField(data, 'featuredImage')))[0],
        rawLastIteration: getField(data, 'lastIteration'),
        firstVersion: new Date(data.sys.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' }),
        lastIteration: new Date(getField(data, 'lastIteration')).toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' }),
        preview: getField(data, 'preview'),
        content: content.html,
        readingTime: Math.ceil(readingTime(content.html).time / 60000),
        category: getField(data, 'category', 'design')
      }
    }
  })
}
