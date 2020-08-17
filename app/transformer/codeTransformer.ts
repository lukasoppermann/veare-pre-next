import { transformedCodeFields } from '../../types/transformer'
import transformer, { getField } from './transformer'
import hljs = require('highlight.js')

export default async (data) => {
  return transformer(data, async (data) => {
    // pre code language
    const programmingLanguage = getField(data, 'language', 'none').toLowerCase()
    // return format
    return <transformedCodeFields>{
      fileOrPath: getField(data, 'fileOrPath'),
      code: hljs.highlight(programmingLanguage, getField(data, 'code', true)).value,
      language: programmingLanguage
    }
  })
}
