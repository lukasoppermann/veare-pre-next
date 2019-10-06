const ProjectModel = require('../models/Project')()

module.exports = (req, res) => {
  // return all projects
  if (req.params[0] === undefined) {
    return res.render('portfolio', {
      projects: ProjectModel.all()
    })
  }
  // return one project
  const project = ProjectModel.findBySlug(`work/${req.params[0]}`)
  // redirect home if param is neither slug nor alias
  if (project === undefined) {
    return res.redirect(301, 'http://' + req.headers.host + '/')
  }
  // render project
  res.render('project', {
    project: project.fields,
    pageClass: 'Page--work Project',
    htmlClass: 'Temp-Override'
  })
}
