import { middleware } from '../../types/middleware'
import progressive from '../templates/pages/progressive'
import error404 from './404'
const { renderToString } = require('@popeindustries/lit-html-server')

const templates = {
  progressive: progressive
}

const route: middleware = async (req, res, next, template) => {
  if (templates[template]) {
    // set header format
    res.setHeader('Content-Type', 'text/html')
    // return content
    return res.end(await renderToString(progressive()))
  }
  // if template is not found
  error404(req, res, next)
}

export default route
