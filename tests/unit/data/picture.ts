import { transformTestData } from './transformTestData'
import asset from './asset'
import richText from './richText'

export default {
  raw: {
    sys: {
      space: { sys: {} },
      type: 'Entry',
      id: '4Q4GshagFQPy8TktScHr1o',
      contentType: { sys: { type: 'Link', linkType: 'ContentType', id: 'picture' } },
      revision: 1,
      createdAt: '2020-04-29T15:02:42.387Z',
      updatedAt: '2020-04-29T15:03:48.321Z',
      environment: { sys: {} }
    },
    fields: {
      title: { 'en-US': 'Run you day — or your day will run you' },
      image: {
        'en-US': [
          asset.raw
        ]
      },
      sources: {
        'en-US': [
          asset.raw
        ]
      },
      classes: { 'en-US': ['pictureClass'] },
      description: { 'en-US': richText.raw },
    }
  },
  transformed: {
    id: '4Q4GshagFQPy8TktScHr1o',
    createdAt: '2020-04-29T15:02:42.387Z',
    updatedAt: '2020-04-29T15:03:48.321Z',
    contentType: 'picture',
    fields: {
      title: 'Run you day — or your day will run you',
      style: "center",
      classes: "pictureClass",
      description: richText.transformed,
      image: asset.transformed,
      sources: [asset.transformed]
    }
  }
} as transformTestData
