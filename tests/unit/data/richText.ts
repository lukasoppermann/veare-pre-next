import { transformTestData } from './transformTestData'

export default {
  raw: {
    nodeType: 'document',
    data: {},
    content: [
      {
        nodeType: 'paragraph',
        data: {},
        content: [
          {
            nodeType: 'text',
            value: 'Hello',
            data: {},
            marks: []
          },
          {
            nodeType: 'hyperlink',
            data: {
              uri: 'name=#design'
            },
            content: [
              {
                data: {},
                marks: [],
                value: 'Design',
                nodeType: 'text'
              }
            ]
          }
        ]
      },
      {
        data: {
          target: {
            sys: {
              space: { sys: { type: 'Link', linkType: 'Space', id: '5dfliyp93yzg' } },
              type: 'Entry',
              id: 'xrJu5xG2PHpyuCmaAXs5b',
              contentType: { sys: { type: 'Link', linkType: 'ContentType', id: 'block' } },
              revision: 3,
              createdAt: '2020-05-18T11:10:57.960Z',
              updatedAt: '2020-05-19T05:01:31.949Z',
              environment: { sys: { id: 'master', type: 'Link', linkType: 'Environment' } }
            },
            fields: {
              cmsTitle: { 'en-US': 'About + Resume Hello Block' },
              content: { 'en-US': {
                  nodeType: 'document',
                  data: {},
                  content: [
                    {
                      nodeType: 'paragraph',
                      data: {},
                      content: [
                        {
                          nodeType: 'text',
                          value: 'Hello',
                          data: {},
                          marks: []
                        },
                      ]
                    }
                  ]
                }
              }
            }
          }
        },
        content: [],
        nodeType: 'embedded-entry-block'
      }
    ]
  },
  transformed: "<p>Hello<a name=\"design\">Design</a></p>"
} as transformTestData
