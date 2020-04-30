import { transformerInterface } from '../../types/transformer'

const transformData = async (items, transformer): Promise<Array<any>> => {
  if (!Array.isArray(items)) {
    items = [items]
  }

  return Promise.all(
    // run transformer on all items
    items.map((item) => transformOrNull(item, transformer), this))
    // remove items that are null
    .then(items => items.filter(item => item !== null)
    )
}

const transformOrNull = (item, transformer) => {
  if (item !== null && typeof item.fields === 'object') {
    return transformer(item)
  }
  return null
}

export default async (data: Object, transformer: transformerInterface) => {
  return transformData(data, transformer)
}

export const getField = (data, fieldName: string, defaultValue: any = null) => {
  const field = data.fields[fieldName]
  if (typeof field !== 'object') {
    return defaultValue || null
  }
  return field[Object.keys(field)[0]]
}
