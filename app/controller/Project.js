'use strict'

const ProjectModel = require('../models/Project')
let model

class Project {
  constructor () {
    model = ProjectModel()
  }

  index (req, res, data) {
    data.projects = model.all()
    res.render('portfolio', data)
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
    res.render('project', data)
  }
}

module.exports = () => new Project()
