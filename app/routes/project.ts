import { middleware } from '../../types/middleware'
import project from '../templates/pages/project'
import error404 from './404'
import cache from '../services/cacheService'
const { renderToString } = require('@popeindustries/lit-html-server')

const route: middleware = async (req, res, next) => {
  // get slug
  const slug = 'work/' + (req.url || '').replace(/^\/|\/$/g, '')
  console.debug(slug)
  // return one project
  const content = cache.get('project')
  // get this page
  const projectContent = content.find((item: any) => item.fields.slug === slug)
  // redirect home if param is neither slug nor alias
  if (projectContent === undefined) {
    error404(req, res, next)
  }
  // set header format
  res.setHeader('Content-Type', 'text/html')
  // render project
  res.end(await renderToString(project(projectContent.fields, req)))
}

export default route
