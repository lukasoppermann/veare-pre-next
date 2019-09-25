'use strict'

const Controller = require('./Controller')
const ProjectModel = require('../models/Project')
let self
let model

class Project extends Controller {
  constructor () {
    super()
    model = ProjectModel()
    self = this
  }

  index (req, res, data) {
    data.projects = model.all()
    self.render(req, res, 'portfolio', data)
  }

  get (req, res, data) {
    const projectSlug = `work/${req.params[0]}`
    const project = model.findBySlug(projectSlug)
    // redirect home if param is neither slug nor alias
    if (project === undefined) {
      return res.redirect(301, 'http://' + req.headers.host + '/')
    }
    // if exists get fields
    data.project = project.fields
    // render project
    self.render(req, res, 'project', data)
  }
}

module.exports = () => new Project()
