import { fieldsTransformerInterface, transformedDataInterface } from '../../types/transformer'
import { contentfulContent } from '../../types/contentfulContent'
import appConfig from '../config/appConfig'
import baseTransformer from './baseTransformer'
// set language to use for extracting content
const language = appConfig.contentfulLanguage || 'en-US'

const transformOrNull = (item: contentfulContent, fieldTransformer) => {
  if (typeof fieldTransformer !== 'function') {
    throw new Error('The second argument for the transformOrNull function must be a transformer function')
  }
  if (item !== null && typeof item.fields === 'object') {
    return baseTransformer(item, fieldTransformer)
  }
  return null
}

const makeArray = (item: any): any[] => !Array.isArray(item) ? [item] : item

export const getField = (data: contentfulContent, fieldName: string, defaultValue: any = null) => {
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
/**
 * transformer
 * @method async
 * @param  items       a contentful cms content object
 * @param  transformer [description]
 * @return             [description]
 */
export default async (items: contentfulContent|contentfulContent[], fieldTransformer: fieldsTransformerInterface): Promise<Array<transformedDataInterface|null>> => {
  return Promise.all(
    // run transformer on all items
    makeArray(items).map(item => transformOrNull(item, fieldTransformer), this))
    // remove items that are null
    .then(items => items.filter(item => item !== null))
}

export const __testing = {
  transformOrNull: transformOrNull,
  makeArray: makeArray
}
