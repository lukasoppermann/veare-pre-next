'use strict'

const Controller = require('./Controller')
const PageModel = require('../models/Page')
let self
let model

class Page extends Controller {
  constructor () {
    super()
    model = PageModel()
    self = this
  }

  get (slug = 'home', req, res, data = {}, view) {
    data.page = model.findBySlug(slug).fields
    data.pageClass = slug
    const template = view || 'page'
    self.render(req, res, template, data)
  }
}

module.exports = () => new Page()
