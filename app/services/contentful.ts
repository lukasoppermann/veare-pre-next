import cache from './cacheService'
import client from './client'
import { transformedDataInterface } from '../../types/transformer'
// transformer
import articleTransformer from '../transformer/articleTransformer'
import assetTransformer from '../transformer/assetTransformer'
import blockTransformer from '../transformer/blockTransformer'
import codeTransformer from '../transformer/codeTransformer'
import linkTransformer from '../transformer/linkTransformer'
import pageTransformer from '../transformer/pageTransformer'
import pictureTransformer from '../transformer/pictureTransformer'
import projectTransformer from '../transformer/projectTransformer'
// Transformer functions
const transformerFunctions = {
  article: articleTransformer,
  asset: assetTransformer,
  block: blockTransformer,
  code: codeTransformer,
  link: linkTransformer,
  page: pageTransformer,
  picture: pictureTransformer,
  project: projectTransformer
}

const getFieldRawLastIterationAsIso = data => new Date(data.fields.rawLastIteration)
/* istanbul ignore next */
export default async () => {
  // get all entries
  /* istanbul ignore next */
  const entriesPromise = client.getEntries({
    limit: 1000,
    order: 'sys.createdAt',
    locale: '*'
  }).then(entries => transformEntries(entries, transformerFunctions))
  // get all content types
  /* istanbul ignore next */
  const contentTypesPromise = client.getContentTypes()
  // await content
  /* istanbul ignore next */
  const [entries, contentTypes] = await Promise.all([entriesPromise, contentTypesPromise])
  // sort content
  /* istanbul ignore next */
  const content = sortContentByType(contentTypes, entries)
  // transform Articles
  /* istanbul ignore next */
  content.article = sortByFieldDesc(content.article, getFieldRawLastIterationAsIso)
  // cache content
  /* istanbul ignore next */
  return Object.keys(content).forEach(contentType => {
    cache.put(contentType, content[contentType])
  })
}

const sortContentByType = (contentTypes, entries): {
  article?: any[];
  project?: any[];
  link?: any[];
  picture?: any[];
  page?: any[];
  block?: any[];
  code?: any[];
} => {
  const content = {}
  // get type ids
  contentTypes.items.forEach(item => {
  // get content by type
    content[item.sys.id] = entries.filter(entry => {
      return entry.contentType === item.sys.id
    })
  })
  return content
}

const transformEntries = async (entries, transformerFunctions) => {
  // transform all entries
  const transformedEntries: [transformedDataInterface] = entries.items.map(entry => transformerFunctions[entry.sys.contentType.sys.id](entry))
  // await all transformations and make sure to extract the items from the array
  return Promise.all(transformedEntries).then((entries: Array<transformedDataInterface>) => entries.map(entry => entry[0]))
}

const sortByFieldDesc = (entries, getFieldToCompare) => {
  return entries.sort((a, b) => {
    a = getFieldToCompare(a)
    b = getFieldToCompare(b)
    if (a < b) {
      return 1
    }
    if (a > b) {
      return -1
    }
    return 0
  })
}

export const __testing = {
  sortByFieldDesc: sortByFieldDesc,
  getFieldRawLastIterationAsIso: getFieldRawLastIterationAsIso,
  sortContentByType: sortContentByType,
  transformEntries: transformEntries
}
