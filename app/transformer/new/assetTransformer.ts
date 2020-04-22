import { transformedDataInterface } from '../../../types/transformer'
import transformer, { getField } from './transformer'

export default async (data) => {
  return transformer(data, async (data): Promise<transformedDataInterface> => {
    // return format
    return <transformedDataInterface>{
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        type: data.sys.type,
        title: getField(data, 'title'),
        description: getField(data, 'description'),
        url: getField(data, 'file').url,
        fileName: getField(data, 'file').fileName,
        details: getField(data, 'file').details,
        contentType: getField(data, 'file').contentType
      }
    }
  })
}
