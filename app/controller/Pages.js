'use strict'

const PageModel = require('../models/Page')
let model

class Page {
  constructor () {
    model = PageModel()
  }

  get (slug = 'home', req, res, data = {}, view) {
    data.page = model.findBySlug(slug).fields
    data.pageClass = slug
    const template = view || 'page'
    res.render(template, data)
  }
}

module.exports = () => new Page()
