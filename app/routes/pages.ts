import page from '../templates/pages/page'
import richText from '../services/newConvertRichText'
const { renderToString } = require('@popeindustries/lit-html-server')

const cache = require('../services/cacheService')()

const getContent = (data, fieldName, defaultValue = null) => {
  const field = data.fields[fieldName]
  if (typeof field !== 'object') {
    return defaultValue || null
  }
  return field[Object.keys(field)[0]]
}

const transformData = async (data): Promise<any> => {
  if (!Array.isArray(data)) {
    data = [data]
  }
  let transformedData = await Promise.all(data.map((item) => transformOrNull(item), this))
  // console.log('transformedData: ',transformedData);

  return transformedData
}

const transformOrNull = (data) => {
  if (data !== null && typeof data.fields === 'object') {
    return PageTransformer(data)
  }
  return null
}

const PageTransformer = async (page) => {
  // console.log(getContent(page, 'content').content[0].data.target.sys.contentType);
  const content = await richText(getContent(page, 'content'))

  return {
    id: page.sys.id,
    createdAt: page.sys.createdAt,
    updatedAt: page.sys.updatedAt,
    fields: {
      type: page.sys.contentType.sys.id,
      slug: getContent(page, 'slug'),
      title: getContent(page, 'title'),
      content: content
    }
  }
}

module.exports = async (req, res) => {
  // get slug
  const slug = req.url.replace(/^\/|\/$/g, '')
  console.log('############################ Current page:', slug, '############################');
  // get content
  const content = await transformData(cache.get('page'))
  // remove empty items
  content.filter(item => item !== null)
  console.log('CONTENT: ', content);
  console.log('..;;;,;::.;:;::,');
  console.log(content.find((item: any) => item.fields['slug'] === slug).fields);


  // get this page
  const pageContent = content.find((item: any) => item.fields['slug'] === slug).fields
  // console.log('This page Content:',pageContent);


  return res.send(await renderToString(page(pageContent)))
}
