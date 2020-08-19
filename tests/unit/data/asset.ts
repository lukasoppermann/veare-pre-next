import { transformTestData } from './transformTestData'
export default {
  raw: {
    sys: {
      space: {
        sys: { type: 'Link', linkType: 'Space', id: '5dfliyp93yzg' }
      },
      type: 'Asset',
      id: '4NYI3g8nZzOPFlbyL3pSHe',
      revision: 2,
      createdAt: '2020-04-29T15:02:57.813Z',
      updatedAt: '2020-04-29T15:12:02.919Z',
      environment: {
        sys: { id: 'master', type: 'Link', linkType: 'Environment' }
      }
    },
    fields: {
      title: { 'en-US': 'Run your day — or your day will run you' },
      file: {
        'en-US': {
          url: '//images.ctfassets.net/5dfliyp93yzg/4NYI3g8nZzOPFlbyL3pSHe/72eadade99c58564e23a40bb2c83bcc1/run-your-day-presenter-veare_2x.jpg',
          details: { size: 208483, image: { width: 1600, height: 1000 } },
          fileName: 'run-your-day-presenter-veare@2x.jpg',
          contentType: 'image/jpeg'
        }
      }
    }
  },
  transformed: {
    id: '4NYI3g8nZzOPFlbyL3pSHe',
    createdAt: '2020-04-29T15:02:57.813Z',
    updatedAt: '2020-04-29T15:12:02.919Z',
    type: 'Asset',
    contentType: 'asset',
    fields: {
      title: 'Run your day — or your day will run you',
      description: null,
      url: '//images.ctfassets.net/5dfliyp93yzg/4NYI3g8nZzOPFlbyL3pSHe/72eadade99c58564e23a40bb2c83bcc1/run-your-day-presenter-veare_2x.jpg',
      fileName: 'run-your-day-presenter-veare@2x.jpg',
      details: { size: 208483, image: { width: 1600, height: 1000 } },
      sizeInBytes: 208483,
      width: 1600,
      height: 1000,
      fileType: 'image/jpeg'
    }
  }
} as transformTestData
