import cache from './cacheService'
import { transformedDataInterface } from '../../types/transformer'
// transformer
import articleTransformer from '../transformer/articleTransformer'
import assetTransformer from '../transformer/assetTransformer'
import blockTransformer from '../transformer/blockTransformer'
import boxedContentTransformer from '../transformer/boxedContentTransformer'
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
  boxedContentSection: boxedContentTransformer,
  code: codeTransformer,
  link: linkTransformer,
  page: pageTransformer,
  picture: pictureTransformer,
  project: projectTransformer
}
// utils
const client = require('./client')

export default async () => {
  // get all entries
  const entriesPromise = client.getEntries({
    limit: 1000,
    order: 'sys.createdAt',
    locale: '*'
  }).then(entries => transformEntries(entries))
  // get all content types
  const contentTypesPromise = client.getContentTypes()
  // await content
  const [entries, contentTypes] = await Promise.all([entriesPromise, contentTypesPromise])
  // cache content
  return cacheContent(contentTypes, entries)
}

const cacheContent = (contentTypes, entries) => {
  // get type ids
  contentTypes.items.forEach(item => {
  // get content by type
    cache().put(item.sys.id, entries.filter(entry => {
      return entry.contentType === item.sys.id
    }))
  })
}

const transformEntries = async entries => {
  // transform all entries
  const transformedEntries: [transformedDataInterface] = entries.items.map(entry => transformerFunctions[entry.sys.contentType.sys.id](entry))
  // await all transformations and make sure to extract the items from the array
  return Promise.all(transformedEntries).then((entries: Array<transformedDataInterface>) => entries.map(entry => entry[0]))
}
