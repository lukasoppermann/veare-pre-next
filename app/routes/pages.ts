import page from '../templates/pages/page'
const { renderToString } = require('@popeindustries/lit-html-server')
const PageModel = require('../models/Page')()

module.exports = async (req, res) => {
  const slug = 
  return res.send(await renderToString(page(PageModel.findBySlug(slug).fields)))
}
