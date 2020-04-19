import { transformedDataInterface } from '../../types/transformer'
import {default as transformer, getField } from './transformerModule'

export default async (data) => {
  return transformer(data, async (data): Promise<transformedDataInterface> => {
    // return format
    return <transformedDataInterface>{
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        type: data.sys.contentType.sys.id,
        items: getField(data, 'items').map(item => {
          item.grow = '1'
          if (item.type !== undefined) {
            item.grow = item.type.replace('Size ', '')
          }
          return item
        })
      }
    }
  })
}
