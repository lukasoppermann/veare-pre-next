import page from '../templates/pages/page'
const { renderToString } = require('@popeindustries/lit-html-server')
const cache = require('../services/cacheService')()
import PageTransformer from '../transformer/PageTransformerModule'

// import richText from '../services/newConvertRichText'
// const getContent = (data, fieldName, defaultValue = null) => {
//   const field = data.fields[fieldName]
//   if (typeof field !== 'object') {
//     return defaultValue || null
//   }
//   return field[Object.keys(field)[0]]
// }
//
// const transformData = async (data): Promise<any> => {
//   if (!Array.isArray(data)) {
//     data = [data]
//   }
//   let transformedData = await Promise.all(data.map((item) => transformOrNull(item), this))
//
//   return transformedData
// }
//
// const transformOrNull = (data) => {
//   if (data !== null && typeof data.fields === 'object') {
//     return PageTransformer(data)
//   }
//   return null
// }
//
// const PageTransformer = async (page) => {
//   // console.log(getContent(page, 'content').content[0].data.target.sys.contentType);
//   const content = await richText(getContent(page, 'content'))
//
//   return {
//     id: page.sys.id,
//     createdAt: page.sys.createdAt,
//     updatedAt: page.sys.updatedAt,
//     fields: {
//       type: page.sys.contentType.sys.id,
//       slug: getContent(page, 'slug'),
//       title: getContent(page, 'title'),
//       content: content
//     }
//   }
// }

module.exports = async (req, res) => {
  // get slug
  const slug = req.url.replace(/^\/|\/$/g, '')
  // get content
  const content = await PageTransformer(cache.get('page'))
  // remove empty items
  content.filter(item => item !== null)
  // get this page
  const pageContent = content.find((item: any) => item.fields['slug'] === slug).fields
  // return final page
  return res.send(await renderToString(page(pageContent)))
}
