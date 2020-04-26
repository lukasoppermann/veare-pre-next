import { transformedDataInterface } from '../../../types/transformer'
import transformer, { getField } from './transformer'
import jsonParse from '../../services/jsonParse'

export default async (data) => {
  return transformer(data, async (data): Promise<transformedDataInterface> => {
    let description = getField(data, 'description')
    try {
      description = jsonParse(description)
    } catch (e) {}
    // return format
    return <transformedDataInterface>{
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        type: data.sys.type,
        title: getField(data, 'title'),
        description: description,
        url: getField(data, 'file').url,
        fileName: getField(data, 'file').fileName,
        details: getField(data, 'file').details,
        sizeInBytes: getField(data, 'file').details.size,
        width: getField(data, 'file').details.image.width,
        height: getField(data, 'file').details.image.height,
        contentType: getField(data, 'file').contentType
      }
    }
  })
}
