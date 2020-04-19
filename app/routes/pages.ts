import page from '../templates/pages/page'
const { renderToString } = require('@popeindustries/lit-html-server')
const cache = require('../services/cacheService')()
import PageTransformer from '../transformer/PageTransformerModule'

module.exports = async (req, res) => {
  // get slug
  const slug = req.url.replace(/^\/|\/$/g, '')
  // get content
  const content = await PageTransformer(cache.get('page'))
  // get this page
  const pageContent = content.find((item: any) => item.fields['slug'] === slug).fields
  // return final page
  return res.send(await renderToString(page(pageContent)))
}
