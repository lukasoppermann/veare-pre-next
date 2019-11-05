import page from '../../resources/litTemplates/pages/page'
const { renderToString } = require('@popeindustries/lit-html-server')
const PageModel = require('../models/Page')()

module.exports = async (_req, res, slug = 'home') => {
  return res.send(await renderToString(page(PageModel.findBySlug(slug).fields)))
}
