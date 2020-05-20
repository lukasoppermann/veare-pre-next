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
          }
        ]
      }
    ]
  },
  transformed: "<p>Hello</p>"
} as transformTestData
