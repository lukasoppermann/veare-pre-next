'use strict'

const Controller = require('./Controller')
const Page = require('../models/Page')
let page
let self

class Pages extends Controller {
  constructor () {
    super()
    self = this
    page = new Page()
  }

  get (req, res, data) {
    data.page = page.findBySlug(req.params[0] || 'home').fields
    self.render(res, 'index', data)
  }
}

module.exports = Pages
