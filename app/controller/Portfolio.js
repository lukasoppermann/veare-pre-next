'use strict'

const Controller = require('./Controller')
const Project = require('../models/Project')
let projects
let self

class Portfolio extends Controller {
  constructor () {
    super()
    self = this
    projects = new Project()
  }

  index (req, res, data) {
    data.projects = projects.all()
    self.render(req, res, 'portfolio', data)
  }

  get (req, res, data) {
    if ((projects.findBySlug(req.params[0]) || projects.findByAlias(req.params[0])) === undefined) {
      return res.redirect(301, 'http://' + req.headers.host + '/')
    }
    data.project = (projects.findBySlug(req.params[0]) || projects.findByAlias(req.params[0])).fields
    // console.log('Project:', data.project, req.params[0])

    self.render(req, res, 'project', data)
  }
}

module.exports = Portfolio
