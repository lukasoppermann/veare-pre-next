import { transformerInterface } from '../../types/transformer'

const language = 'en-US'

const transformOrNull = (item, transformer) => {
  if (typeof transformer !== 'function') {
    throw new Error('The second argument for the transformOrNull function must be a transformer function')
  }
  if (item !== null && typeof item.fields === 'object') {
    return transformer(item)
  }
  return null
}

const makeArray = (item: any): any[] => {
  // if item is not an arry, make it one
  if (!Array.isArray(item)) {
    item = [item]
  }
  // return array
  return item
}

export default async (items: Object, transformer: transformerInterface): Promise<Array<any>> => {
  return Promise.all(
    // run transformer on all items
    makeArray(items).map((item) => transformOrNull(item, transformer), this))
    // remove items that are null
    .then(items => items.filter(item => item !== null))
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
  if (field === null || typeof field !== 'object' || !Object.prototype.hasOwnProperty.call(field, language)) {
    return defaultValue || null
  }
  // return value
  return field[language]
}

export const __testing = {
  transformOrNull: transformOrNull
}
