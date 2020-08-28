import { transformTestData } from './transformTestData'

export default {
  raw: {
    sys: {
      space: { sys: {} },
      type: 'Entry',
      id: 'Mai1igaIvkUTtGzqZm5Ai',
      contentType: {
        sys: {
          type: 'Link',
          linkType: 'ContentType',
          id: 'token'
        }
      },
      revision: 1,
      createdAt: '2020-04-29T14:56:42.805Z',
      updatedAt: '2020-04-29T15:05:24.398Z',
      environment: { sys: {} }
    },
    fields: {
      tokenType: { 'en-US': 'Placeholder'},
      value: { 'en-US': 'homepage_header'}
    }
  },
  transformed: {
    id: 'Mai1igaIvkUTtGzqZm5Ai',
    createdAt: '2020-04-29T14:56:42.805Z',
    updatedAt: '2020-04-29T15:05:24.398Z',
    contentType: 'token',
    type: 'Entry',
    fields: {
      tokenType: 'placeholder',
      value: 'homepage_header'
    }
  }
} as transformTestData