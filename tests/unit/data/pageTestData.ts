import { transformTestData } from './transformTestData'
import richText from './richTextTestData'

export default {
  raw: {
    sys: {
      space: { sys: { type: 'Link', linkType: 'Space', id: '5dfliyp93yzg' } },
      type: 'Entry',
      id: '17MuwC1Ho2IMMAUyocU28o',
      contentType: { sys: { type: 'Link', linkType: 'ContentType', id: 'page' } },
      revision: 26,
      createdAt: '2018-02-05T07:04:38.785Z',
      updatedAt: '2020-05-19T12:42:35.026Z',
      environment: { sys: { id: 'master', type: 'Link', linkType: 'Environment' } }
    },
    fields: {
      title: { 'en-US': 'Home' },
      slug: { 'en-US': 'home' },
      lastIteration: { 'en-US': '2018-12-04' },
      description: {
        'en-US': 'Framer X introduces some very novel and unique features. So let’s see if Framer X is right for you.'
      },
      content: { 'en-US': richText.raw }
    }
  },
  transformed: {
    id: '17MuwC1Ho2IMMAUyocU28o',
    createdAt: '2018-02-05T07:04:38.785Z',
    updatedAt: '2020-05-19T12:42:35.026Z',
    contentType: 'page',
    type: 'Entry',
    fields: {
      slug: 'home',
      title: 'Home',
      rawLastIteration: '2018-12-04',
      lastIteration: 'Dec 4, 2018',
      description: 'Framer X introduces some very novel and unique features. So let’s see if Framer X is right for you.',
      content: richText.transformed,
      embeddedBlocks: [
        "xrJu5xG2PHpyuCmaAXs5b"
      ]
    }
  }
} as transformTestData
