import blog from '../templates/pages/blog'
import article from '../templates/pages/article'
import cache from '../services/cacheService'
const { renderToString } = require('@popeindustries/lit-html-server')

module.exports = {
  index: async (req, res) => res.send(await renderToString(blog(cache.get('article'), req))),
  get: async (req, res) => {
    // get articles from cache
    const content = cache.get('article')
    // get individual article
    const articleContent = content.find((item: any) => item.fields.slug === req.params[0]).fields
    // if content exists
    if (articleContent) {
      return res.send(await renderToString(article(articleContent, req)))
    }
    // if not content existds redirect to blog
    return res.redirect(301, req.protocol + '://' + req.headers.host + req.url.replace(req.params[0], ''))
  }
}
