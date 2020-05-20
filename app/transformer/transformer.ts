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
  if (typeof transformer !== 'function') {
    throw new Error('The second argument for the transformOrNull function must be a transformer function')
  }
  if (item !== null && typeof item.fields === 'object') {
    return transformer(item)
  }
  return null
}

export default async (data: Object, transformer: transformerInterface) => {
  return transformData(data, transformer)
}

export const getField = (data, fieldName: string, defaultValue: any = null) => {
  // check if data is valid
  if (typeof data !== 'object' || typeof data.fields !== 'object') {
    throw new Error('Invalid data argument provided. Data must be an object with a fields property that is an object as well.')
  }
  // check for fieldName
  if (typeof fieldName !== 'string') { //  || !data.fields.hasOwnProperty(fieldName)
    throw new Error(`Invalid fieldName provided: "${fieldName}"`)
  }
  const field = data.fields[fieldName]
  if (typeof field !== 'object') {
    return defaultValue || null
  }
  return field[Object.keys(field)[0]]
}

export const __testing = {
  transformOrNull: transformOrNull
}
