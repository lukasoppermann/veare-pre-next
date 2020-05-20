import { transformTestData } from './transformTestData'
import picture from './picture'

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
          id: 'link'
        }
      },
      revision: 1,
      createdAt: '2020-04-29T14:56:42.805Z',
      updatedAt: '2020-04-29T15:05:24.398Z',
      environment: { sys: {} }
    },
    fields: {
      title: { 'en-US': 'After hours & side projects ' },
      subtitle: { 'en-US': 'Behance' },
      link: { 'en-US': 'https://www.behance.net/lukasoppermann' },
      targetBlank: { 'en-US': true },
      cssClasses: { 'en-US': ["link-class", "second-class"] },
      picture: { 'en-US': picture.raw },
    }
  },
  transformed: {
    id: 'Mai1igaIvkUTtGzqZm5Ai',
    createdAt: '2020-04-29T14:56:42.805Z',
    updatedAt: '2020-04-29T15:05:24.398Z',
    contentType: 'link',
    fields: {
      title: 'After hours & side projects ',
      subtitle: 'Behance',
      link: 'https://www.behance.net/lukasoppermann',
      target: '_blank',
      rel: 'noopener',
      classes: "link-class second-class",
      picture: picture.transformed
    }
  }
} as transformTestData
