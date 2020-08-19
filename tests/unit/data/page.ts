import { transformTestData } from './transformTestData'
import richText from './richText'

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
      content: richText.transformed
    }
  }
} as transformTestData
