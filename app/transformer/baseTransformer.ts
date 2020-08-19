import { fieldsTransformerInterface, transformedDataInterface } from '../../types/transformer'
import { contentfulContent } from '../../types/contentfulContent'

export default async (item: contentfulContent, fieldTransformer: fieldsTransformerInterface): Promise<transformedDataInterface> => {
  // used when type is asset
  let contentType = item.sys.type.toLowerCase()
  // if entry
  if (item.sys.type === 'Entry') {
    contentType = item.sys.contentType.sys.id
  }

  return {
    id: item.sys.id,
    type: item.sys.type,
    createdAt: item.sys.createdAt,
    updatedAt: item.sys.updatedAt,
    contentType: contentType,
    fields: await fieldTransformer(item)
  }
}
