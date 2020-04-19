import { transformedData } from '../../types/transformer'
import {default as transformer, getField } from './transformerModule'

import richText from '../services/newConvertRichText'
console.log(getField, typeof getField);

export default async (page) => {
  return transformer(page, async (page): Promise<transformedData> => {
    const content = await richText(getField(page, 'content'))

    return {
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
