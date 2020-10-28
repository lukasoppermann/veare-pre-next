import { transformedArticleFields } from '../../types/transformer'
import transformer, { getField } from './transformer'
import sortByFieldDesc from '../services/sortByFieldDesc'
import richText from '../services/convertRichText'
const readingTime = require('reading-time')

export default async (data) => {
  return transformer(data, async (data) => {
    // transform richText
    const content = await richText(getField(data, 'content'), {
      picture: {
        loading: 'lazy',
        sourcesFunction: (picture) => [
          {
            fileType: 'image/webp',
            srcset: [500, 1000, 1400, 2000].map(size => `${picture.image.fields.url}?fm=webp&w=${size} ${size}w`).join(', '),
            sizes: '(min-width: 1400px) 1000px, (min-width: 1000px) 900px, (min-width: 768px) 700px, 100vw'
          }
        ]
      }
    })
    // return format
    return <transformedArticleFields>{
      slug: getField(data, 'slug'),
      title: getField(data, 'title'),
      rawLastIteration: getField(data, 'lastIteration'),
      lastIteration: new Date(getField(data, 'lastIteration')).toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' }),
      description: getField(data, 'description'),
      content: content.html,
      readingTime: Math.ceil(readingTime(content.html).time / 60000),
      category: getField(data, 'category', 'design'),
      relatedContent: getField(data, 'relatedContent', []).map(item => item.sys.id)
    }
  })
}

/**
 * @function postArticlesTransformer — attach related articles & sort by last iteration date
 * @param {array} articles
 */
export const postArticlesTransformer = (articles: any[]) => {
  // attach related articles
  articles.map(article => {
    // attach to article
    article.fields.relatedContent = attachRelatedContent(article, articles || [], 2)
    return article
  })
  // return sorted array
  return sortByFieldDesc(articles, getFieldRawLastIterationAsIso)
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

export const __testing = {
  getFieldRawLastIterationAsIso: getFieldRawLastIterationAsIso,
  randomBetween: randomBetween
}
