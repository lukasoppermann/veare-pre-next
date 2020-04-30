import blog from '../templates/pages/blog'
import article from '../templates/pages/article'
import cache from '../services/cacheService'
const { renderToString } = require('@popeindustries/lit-html-server')

module.exports = {
  index: async (_req, res) => {
    // get articles from cache
    let content = cache().get('article')
    // sort by date
    content = content.sort((a, b) => {
      const dateA = new Date(a.fields.rawdate)
      const dateB = new Date(b.fields.rawdate)
      if (dateA < dateB) {
        return 1
      }
      if (dateA > dateB) {
        return -1
      }
      return 0
    })
    // return rendered template
    return res.send(await renderToString(blog(content)))
  },
  get: async (req, res) => {
    // get articles from cache
    const content = cache().get('article')
    // get individual article
    const articleContent = content.find((item: any) => item.fields.slug === req.params[0]).fields
    // if content exists
    if (articleContent) {
      return res.send(await renderToString(article(articleContent)))
    }
    // if not content existds redirect to blog
    return res.redirect(301, req.protocol + '://' + req.headers.host + req.url.replace(req.params[0], ''))
  }
}
