import blog from '../../resources/litTemplates/pages/blog'
import article from '../../resources/litTemplates/pages/article'
const { renderToString } = require('@popeindustries/lit-html-server')
const ArticleModel = require('../models/Article')()

module.exports = {
  index: async (_req, res) => res.send(await renderToString(blog(ArticleModel.all()))),
  get: async (req, res) => {
    const articleData = ArticleModel.findBySlug(req.params[0])
    if (articleData) {
      return res.send(await renderToString(article(articleData)))
    } else {
      return res.redirect(301, req.protocol + '://' + req.headers.host + req.url.replace(req.params[0], ''))
    }
  }
}
