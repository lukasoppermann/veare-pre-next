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
    self.render(res, 'portfolio', data)
  }

  get (req, res, data) {
    data.project = (projects.findBySlug(req.params[0]) || projects.findByAlias(req.params[0])).fields
    // console.log('Project:', data.project, req.params[0])
    // if (data.project === undefined) {
    //   return res.redirect(301, 'http://' + req.headers.host + '/')
    // }
    self.render(res, 'project', data)
  }
}

module.exports = Portfolio
