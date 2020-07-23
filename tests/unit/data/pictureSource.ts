import { transformTestData } from './transformTestData'
import asset from './asset'

export default {
  raw: {
    sys: {
      space: { sys: {} },
      type: 'Entry',
      id: '4Q4GshagFQPy8TktScHr1o',
      contentType: { sys: { type: 'Link', linkType: 'ContentType', id: 'pictureSource' } },
      revision: 1,
      createdAt: '2020-04-29T15:02:42.387Z',
      updatedAt: '2020-04-29T15:03:48.321Z',
      environment: { sys: {} }
    },
    fields: {
      media: { 'en-US': '(max-width: 320px)' },
      sizes: { 'en-US': '100vw' },
      images: {
        'en-US': [
          asset.raw,
          asset.raw
        ]
      }
    }
  },
  transformed: {
    id: '4Q4GshagFQPy8TktScHr1o',
    createdAt: '2020-04-29T15:02:42.387Z',
    updatedAt: '2020-04-29T15:03:48.321Z',
    contentType: 'pictureSource',
    fields: {
      media: '(max-width: 320px)',
      sizes: '100vw',
      type: 'image/jpeg',
      srcset: asset.transformed.fields.url + ' ' + require('path').parse(asset.transformed.fields.fileName).name.split('@')[1]
              + ', '
              + asset.transformed.fields.url + ' ' + require('path').parse(asset.transformed.fields.fileName).name.split('@')[1] 
    }
  }
} as transformTestData
