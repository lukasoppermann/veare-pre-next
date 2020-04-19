import { transformedDataInterface } from '../../types/transformer'
import {default as transformer, getField } from './transformerModule'

import richText from '../services/newConvertRichText'

export default async (page) => {
  return transformer(page, async (page): Promise<transformedDataInterface> => {
    // transform richText
    let content = await richText(getField(page, 'content'))
    // return format
    return <transformedDataInterface>{
      id: page.sys.id,
      createdAt: page.sys.createdAt,
      updatedAt: page.sys.updatedAt,
      fields: {
        type: page.sys.contentType.sys.id,
        slug: getField(page, 'slug'),
        title: getField(page, 'title'),
        content: content
      }
    }
  })
}
