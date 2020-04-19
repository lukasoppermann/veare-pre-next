import { transformerInterface } from '../../types/transformer'

export const getField = (data, fieldName, defaultValue = null) => {
  const field = data.fields[fieldName]
  if (typeof field !== 'object') {
    return defaultValue || null
  }
  return field[Object.keys(field)[0]]
}

const transformData = async (items, transformer): Promise<any> => {
  if (!Array.isArray(items)) {
    items = [items]
  }

  return await Promise.all(items.map((item) => transformOrNull(item, transformer), this))
}

const transformOrNull = (item, transformer) => {
  if (item !== null && typeof item.fields === 'object') {
    return transformer(item)
  }
  return null
}

export default async (data: Object, transformer: transformerInterface) => {
  return await transformData(data, transformer)
}
