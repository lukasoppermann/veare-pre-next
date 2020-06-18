import { transformTestData } from './transformTestData'
export default {
  raw: {
    sys: {
      space: { sys: { type: 'Link', linkType: 'Space', id: '5dfliyp93yzg' } },
      type: 'Entry',
      id: '67Kqs4uXxWSpfRnUajrsX0',
      contentType: { sys: { type: 'Link', linkType: 'ContentType', id: 'code' } },
      revision: 1,
      createdAt: '2019-12-03T22:07:18.216Z',
      updatedAt: '2019-12-03T22:07:38.500Z',
      environment: { sys: { id: 'master', type: 'Link', linkType: 'Environment' } }
    },
    fields: {
      fileOrPath: { 'en-US': 'package.json' },
      language: { 'en-US': 'javascript' },
      code: {
        'en-US': '"scripts": {\n' +
          '\t…,\n' +
          '\t"build": "npm run build:js:watch & npm run build:css:watch",\n' +
          `\t"start": "node_modules/.bin/ttab -t 'Node Server' 'npm run supervisor' & node_modules/.bin/ttab -t 'Building assets' 'npm run build'"\n` +
          '}'
      }
    }
  },
  transformed: {
    id: '67Kqs4uXxWSpfRnUajrsX0',
    createdAt: '2019-12-03T22:07:18.216Z',
    updatedAt: '2019-12-03T22:07:38.500Z',
    contentType: 'code',
    fields: {
      fileOrPath: 'package.json',
      code: '<span class=\"hljs-string\">&quot;scripts&quot;</span>: {\n' +
        '\t…,\n' +
        '<span class=\"hljs-string\">&quot;build&quot;</span>: <span class=\"hljs-string\">&quot;npm run build:js:watch &amp; npm run build:css:watch&quot;</span>,' +
        '<span class=\"hljs-string\">&quot;start&quot;</span>: <span class=\"hljs-string\">&quot;node_modules/.bin/ttab -t &#x27;Node Server&#x27; &#x27;npm run supervisor&#x27; &amp; node_modules/.bin/ttab -t &#x27;Building assets&#x27; &#x27;npm run build&#x27;&quot;</span>' +
        '}',
      language: 'javascript'
    }
  }
} as transformTestData
