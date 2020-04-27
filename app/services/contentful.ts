import { errorLog as errorLogFn } from './errorhandling'
// transformer
import articleTransformer from '../transformer/new/articleTransformer'
import assetTransformer from '../transformer/new/assetTransformer'
import blockTransformer from '../transformer/new/blockTransformer'
import boxedContentTransformer from '../transformer/new/boxedContentTransformer'
import codeTransformer from '../transformer/new/codeTransformer'
import linkTransformer from '../transformer/new/linkTransformer'
import pageTransformer from '../transformer/new/pageTransformer'
import pictureElementTransformer from '../transformer/new/pictureElementTransformer'
import pictureTransformer from '../transformer/new/pictureTransformer'
import projectTransformer from '../transformer/new/projectTransformer'
// Transformer functions
const transformerFunctions = {
  article: articleTransformer,
  asset: assetTransformer,
  block: blockTransformer,
  boxedContentSection: boxedContentTransformer,
  code: codeTransformer,
  link: linkTransformer,
  page: pageTransformer,
  pictureElement: pictureElementTransformer,
  picture: pictureTransformer,
  project: projectTransformer
}
// utils
const client = require('./client')
const cache = require('./cacheService')()

const contentful = async (callback, errorLog = errorLogFn) => {
  try {
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
    // console.debug(entries[1].fields.previewImage.fields)
    // console.debug(contentTypes.items)
    // cache content
    cacheContent(contentTypes, entries)
    // run callback
    callback()
  } catch (e) {
    errorLog(e)
  }
}

const cacheContent = (contentTypes, entries) => {
  // get type ids
  contentTypes.items.forEach(item => {
  // get content by type
    cache.put(item.sys.id, entries.filter(entry => {
      // console.debug('WEEEEE',entry)
      return entry.contentType === item.sys.id
    }))
  })
}

const transformEntries = async entries => {
  // transform all entries
  entries = entries.items.map(entry => transformerFunctions[entry.sys.contentType.sys.id](entry))
  // await all transformations and make sure to extract the items from the array
  return Promise.all(entries).then(entries => entries.map(entry => entry[0]))
}

module.exports = contentful
