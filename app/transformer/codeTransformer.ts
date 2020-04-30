import { transformedDataInterface } from '../../types/transformer'
import transformer, { getField } from './transformer'
import hljs = require('highlight.js')

export default async (data) => {
  return transformer(data, async (data): Promise<transformedDataInterface> => {
    // pre code language
    const programmingLanguage = getField(data, 'language', 'none').toLowerCase()
    // return format
    return <transformedDataInterface>{
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      contentType: data.sys.contentType.sys.id,
      fields: {
        fileOrPath: getField(data, 'fileOrPath'),
        code: hljs.highlight(programmingLanguage, getField(data, 'code', true)).value,
        language: programmingLanguage
      }
    }
  })
}
