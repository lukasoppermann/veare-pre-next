import projectTransformer from '../transformer/new/projectTransformer'

import project from '../templates/pages/project'
const { renderToString } = require('@popeindustries/lit-html-server')
const cache = require('../services/cacheService')()
// const ProjectModel = require('../models/Project')()

module.exports = async (req, res) => {
  // get slug
  const slug = req.path.replace(/^\/|\/$/g, '')
  // return one project
  const content = await projectTransformer(cache.get('project'))
  // get this page
  const projectContent = content.find((item: any) => item.fields.slug === slug).fields
  // redirect home if param is neither slug nor alias
  if (projectContent === undefined) {
    return res.redirect(301, 'http://' + req.headers.host + '/')
  }
  // render project
  return res.send(await renderToString(project(projectContent)))
}
