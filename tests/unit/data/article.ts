import { transformTestData } from './transformTestData'
import richText from './richText'

export default {
  raw: {
    sys: {
      space: { sys: { type: 'Link', linkType: 'Space', id: '5dfliyp93yzg' } },
      type: 'Entry',
      id: '1tf0GhGsh6EYqU88wqiE6q',
      contentType: { sys: { type: 'Link', linkType: 'ContentType', id: 'article' } },
      revision: 26,
      createdAt: '2018-12-03T09:59:05.298Z',
      updatedAt: '2020-04-28T20:06:31.633Z',
      environment: { sys: { id: 'master', type: 'Link', linkType: 'Environment' } }
    },
    fields: {
      title: { 'en-US': 'Framer X — a review' },
      slug: { 'en-US': 'framer-x-a-review' },
      lastIteration: { 'en-US': '2018-12-04' },
      category: { 'en-US': 'technology' },
      relatedContent: { 'en-US': [ {
        sys: {
          id: '1tf0GhGsh6EYqU88wqiE6q'
        }
      } ] },
      preview: {
        'en-US': 'Framer X is the latest software by the team at Framer. They are trying to solve “digital product design from start to finish”. They introduced some very novel and unique features. So let’s see if Framer X is right for you.'
      },
      seoDescription: {
        'en-US': 'Framer X introduces some very novel and unique features. So let’s see if Framer X is right for you.'
      },
      content: { 'en-US': richText.raw }
    }
  },
  transformed: {
    id: '1tf0GhGsh6EYqU88wqiE6q',
    publishedVersions: 26,
    createdAt: '2018-12-03T09:59:05.298Z',
    updatedAt: '2020-04-28T20:06:31.633Z',
    contentType: 'article',
    fields: {
      slug: 'framer-x-a-review',
      title: 'Framer X — a review',
      rawLastIteration: '2018-12-04',
      lastIteration: 'Dec 4, 2018',
      preview: 'Framer X is the latest software by the team at Framer. They are trying to solve “digital product design from start to finish”. They introduced some very novel and unique features. So let’s see if Framer X is right for you.',
      content: richText.transformed,
      readingTime: 1,
      category: 'technology',
      relatedContent: ['1tf0GhGsh6EYqU88wqiE6q']
    }
  }
} as transformTestData
