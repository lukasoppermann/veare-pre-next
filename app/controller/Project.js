'use strict'

const Controller = require('./Controller')
const ProjectModel = require('../models/Project')
let self

class Project extends Controller {
  constructor () {
    super()
    this.model = ProjectModel()
    self = this
  }

  index (req, res, data) {
    data.projects = this.model.all()
    self.render(req, res, 'portfolio', data)
  }

  get (req, res, data) {
    let project = (this.model.findBySlug(req.params[0]) || this.model.findByAlias(req.params[0]))
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
