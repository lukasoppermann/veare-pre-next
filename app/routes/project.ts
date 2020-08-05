import { middleware } from '../../types/middleware'
import project from '../templates/pages/project'
import error404 from './404'
import cache from '../services/cacheService'
const { renderToString } = require('@popeindustries/lit-html-server')

const route: middleware = async (req, res, next) => {
  // get slug
  const slug = req.path.substr(1) // remove slash from beginning of path
  // return one project
  const content = cache.get('project')
  // get this page
  const projectContent = content.find((item: any) => item.fields.slug === slug)
  // display if project is found
  if (projectContent !== undefined) {
    // set header format
    res.setHeader('Content-Type', 'text/html')
    // render project
    return res.end(await renderToString(project(projectContent.fields, req)))
  }
  // invalid project url
  error404(req, res, next)
}

export default route
