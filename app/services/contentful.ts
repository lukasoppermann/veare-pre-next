import cache from './cacheService'
import client from './client'
import { transformedDataInterface } from '../../types/transformer'
// transformer
import articleTransformer, { postArticlesTransformer } from '../transformer/articleTransformer'
import assetTransformer from '../transformer/assetTransformer'
import blockTransformer from '../transformer/blockTransformer'
import codeTransformer from '../transformer/codeTransformer'
import linkTransformer from '../transformer/linkTransformer'
import pageTransformer, { postPagesTransformer } from '../transformer/pageTransformer'
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
/* istanbul ignore next */
export default async () => {
  /* istanbul ignore next */
  const [entries, contentTypes] = await Promise.all([
    // get all entries
    client.getEntries({
      limit: 1000,
      order: 'sys.createdAt',
      locale: '*'
    }).then(entries => transformEntries(entries, transformerFunctions)),
    // get all content types
    client.getContentTypes()
  ])
  // sort content
  /* istanbul ignore next */
  const content = sortContentByType(contentTypes, entries)
  // post transform content
  /* istanbul ignore next */
  content.article = postArticlesTransformer(content.article)
  content.page = postPagesTransformer(content.page, entries)
  // cache content by type
  /* istanbul ignore next */
  return Object.keys(content).forEach(contentType => {
    cache.put(contentType, content[contentType])
  })
}

const sortContentByType = (contentTypes, entries): {
  article: any[];
  project: any[];
  link: any[];
  picture: any[];
  pictureSource: any[];
  page: any[];
  block: any[];
  code: any[];
  token: any[];
} => {
  const content = {
    article: [],
    project: [],
    page: [],
    link: [],
    picture: [],
    pictureSource: [],
    block: [],
    code: [],
    token: []
  }
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

export const __testing = {
  sortContentByType: sortContentByType,
  transformEntries: transformEntries
}
