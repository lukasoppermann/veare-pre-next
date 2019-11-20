import project from '../templates/pages/project'
const { renderToString } = require('@popeindustries/lit-html-server')
const ProjectModel = require('../models/Project')()

module.exports = async (req, res) => {
  // return one project
  const projectData = ProjectModel.findBySlug(`work/${req.params[0]}`)
  // redirect home if param is neither slug nor alias
  if (projectData === undefined) {
    return res.redirect(301, 'http://' + req.headers.host + '/')
  }
  // render project
  return res.send(await renderToString(project(projectData.fields)))
}
