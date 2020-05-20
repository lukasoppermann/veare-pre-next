import { transformTestData } from './transformTestData'
import richText from './richText'
export default {
  raw: {
    sys: {
      space: { sys: { type: 'Link', linkType: 'Space', id: '5dfliyp93yzg' } },
      type: 'Entry',
      id: '5gpHuWDaqF8eN9mPkTPl2Z',
      contentType: { sys: { type: 'Link', linkType: 'ContentType', id: 'block' } },
      revision: 6,
      createdAt: '2020-05-18T11:49:19.547Z',
      updatedAt: '2020-05-19T12:28:29.774Z',
      environment: { sys: { id: 'master', type: 'Link', linkType: 'Environment' } }
    },
    fields: {
      cmsTitle: { 'en-US': 'About + Resume' },
      slug: { 'en-US': 'about-resume' },
      classes: {'en-US': [ 'Grid-32', 'Index__resume' ] },
      content: { 'en-US': richText.raw }
    }
  },
  transformed: {
    id: '5gpHuWDaqF8eN9mPkTPl2Z',
    createdAt: '2020-05-18T11:49:19.547Z',
    updatedAt: '2020-05-19T12:28:29.774Z',
    contentType: 'block',
    fields: {
      slug: 'about-resume',
      classes: 'Grid-32 Index__resume',
      content: richText.transformed
    }
  }
} as transformTestData
