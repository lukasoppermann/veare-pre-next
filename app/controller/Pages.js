'use strict'

const Controller = require('./Controller')
const PageModel = require('../models/Page')
let self

class Page extends Controller {
  constructor () {
    super()
    this.model = PageModel()
    self = this
  }

  get (req, res, data = {}, view) {
    data.page = this.model.findBySlug(req.params[0] || 'home').fields
    let template = view || 'page'
    self.render(req, res, template, data)
  }
}

module.exports = () => new Page()
