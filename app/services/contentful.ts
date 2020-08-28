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
import pictureSourceTransformer from '../transformer/pictureSourceTransformer'
import projectTransformer from '../transformer/projectTransformer'
import tokenTransformer from '../transformer/tokenTransformer'
// Transformer functions
const transformerFunctions = {
  article: articleTransformer,
  asset: assetTransformer,
  block: blockTransformer,
  code: codeTransformer,
  link: linkTransformer,
  page: pageTransformer,
  picture: pictureTransformer,
  pictureSource: pictureSourceTransformer,
  project: projectTransformer,
  token: tokenTransformer
}

const getFieldRawLastIterationAsIso = data => new Date(data.fields.rawLastIteration)
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min) + min)

const attachRelatedContent = (item, entries: any[], amount = 3): {} => {
  // remove item from entries
  entries = entries.filter(entry => entry.id !== item.id)
  // return array of related content objects
  return [...item.fields.relatedContent, ...new Array(amount)].slice(0, amount).map(id => {
    // get random id if not present
    id = id !== undefined ? id : entries[randomBetween(0, entries.length - 1)].id
    // get index of defined id or random id in entries array
    const index = entries.findIndex(entry => entry.id === id)
    // store object from entry in const
    const entryObject = entries[index]
    // remove from entries array to avoid double entry
    entries.splice(index, 1)
    // return object
    return entryObject
  })
}
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
  if (content.article !== undefined && content.article.length > 0) {
    content.article = sortByFieldDesc(content.article, getFieldRawLastIterationAsIso)
    // attach related articles
    content.article.map(article => {
      // attach to article
      article.fields.relatedContent = attachRelatedContent(article, content.article || [], 2)
      return article
    })
  }
  // cache content by type
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
  pictureSource?: any[];
  page?: any[];
  block?: any[];
  code?: any[];
  token?: any[];
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

const sortByFieldDesc = (entries, getFieldToCompare): any[] => {
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
