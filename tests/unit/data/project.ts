import { transformTestData } from './transformTestData'
import richText from './richText'
import picture from './picture'
import asset from './asset'

export default {
  raw: {
    sys: {
      space: { sys: { type: 'Link', linkType: 'Space', id: '5dfliyp93yzg' } },
      type: 'Entry',
      id: '2f838fVWY0IcacGMscaEA',
      contentType: { sys: { type: 'Link', linkType: 'ContentType', id: 'project' } },
      revision: 55,
      createdAt: '2018-02-08T18:16:47.717Z',
      updatedAt: '2020-04-28T20:20:54.885Z',
      environment: { sys: { id: 'master', type: 'Link', linkType: 'Environment' } }
    },
    fields: {
      title: { 'en-US': 'Bringing biking into the future' },
      slug: { 'en-US': 'work/nyon' },
      durationStart: { 'en-US': '2017-01-06' },
      durationEnd: { 'en-US': '2018-08-01' },
      client: { 'en-US': 'Bosch' },
      approach: { 'en-US': richText.raw },
      responsibilities: { 'en-US': ["UI/UX design", "leading the design team"] },
      team: { 'en-US': ["Design lead", "2 Developers", "Product Owner"] },
      roleAndTeam: { 'en-US': richText.raw },
      tableOfContent: { 'en-US': true },
      header: { 'en-US': picture.raw },
      previewImage: { 'en-US': asset.raw },
      content: { 'en-US': richText.raw }
    }
  },
  transformed: {
    id: '2f838fVWY0IcacGMscaEA',
    createdAt: '2018-02-08T18:16:47.717Z',
    updatedAt: '2020-04-28T20:20:54.885Z',
    contentType: 'project',
    fields: {
      slug: 'work/nyon',
      title: 'Bringing biking into the future',
      durationStart: '2017-01-06',
      durationEnd: '2018-08-01',
      duration: {
        month: 7,
        totalWeeks: 81,
        years: 1,
      },
      years: {
        start: 2017,
        end: 2018,
      },
      client: 'Bosch',
      header: picture.transformed,
      previewImage: asset.transformed,
      anchors: [
        "design",
      ],
      approach: richText.transformed,
      responsibilities: ["UI/UX design", "leading the design team"],
      team: ["Design lead", "2 Developers", "Product Owner"],
      content: richText.transformed,
      roleAndTeam: richText.transformed
    }
  }
} as transformTestData
