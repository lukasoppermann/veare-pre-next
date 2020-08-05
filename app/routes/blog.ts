import { middleware } from '../../types/middleware'
import blog from '../templates/pages/blog'
import article from '../templates/pages/article'
import cache from '../services/cacheService'
import error404 from './404'
const { renderToString } = require('@popeindustries/lit-html-server')

const route: middleware = async (req, res, _next) => {
  // parse url
  const path = (req.url || '').replace(/^\/+|\/+$/g, '').substr(5)
  // if path is "" show blog listing
  if (path.length === 0) {
    // set header format
    res.setHeader('Content-Type', 'text/html')
    // return template
    return res.end(await renderToString(blog(cache.get('article'), req)))
  }
  // retrieve specific post
  // get articles from cache
  const content = cache.get('article')
  // get individual article
  const requestedArticle = content.find((item: any) => item.fields.slug === path)
  // if content exists
  if (requestedArticle) {
    // set header format
    res.setHeader('Content-Type', 'text/html')
    // return template
    return res.end(await renderToString(article(requestedArticle.fields, req)))
  }
  // if not content existds redirect to blog
  error404(req, res, _next, { location: '/blog' })
}

export default route
