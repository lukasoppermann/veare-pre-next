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
        classes: getField(data, 'classes', []).join(' '),
        items: getField(data, 'items'),
        variables: getField(data, 'variables', []).reduce(
          (obj, item) => Object.assign(obj, { [item.key]: item.value }), {}
        )
      }
    }
  })
}


// items: this.getContent(data, 'items').map(item => {
//   return new Transformers[item.sys.contentType.sys.id](item).first()
// }),
// classes: (this.getContent(data, 'classes') || []).join(' '),
// variables: this.getContent(data, 'variables', []).reduce(
//   (obj, item) => Object.assign(obj, { [item.key]: item.value }), {}
// )
