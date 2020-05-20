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
      }
    ]
  },
  transformed: "<p>Hello<a name=\"design\">Design</a></p>"
} as transformTestData
