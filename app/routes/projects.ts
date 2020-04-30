import project from '../templates/pages/project'
import cache from '../services/cacheService'
const { renderToString } = require('@popeindustries/lit-html-server')

module.exports = async (req, res) => {
  // get slug
  const slug = req.path.replace(/^\/|\/$/g, '')
  // return one project
  const content = cache().get('project')
  // get this page
  const projectContent = content.find((item: any) => item.fields.slug === slug)
  // redirect home if param is neither slug nor alias
  if (projectContent === undefined) {
    return res.redirect(301, 'http://' + req.headers.host + '/')
  }
  // render project
  return res.send(await renderToString(project(projectContent.fields)))
}
