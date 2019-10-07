const ProjectModel = require('../models/Project')()
const PageModel = require('../models/Page')()
const fs = require('fs')
const portfolioItems = JSON.parse(fs.readFileSync('resources/templates/data/portfolio.json'))
const cache = require('../services/cacheService')()

module.exports = (req, res) => {
  res.render('index', {
    page: PageModel.findBySlug('home').fields,
    pageClass: 'home',
    projects: ProjectModel.all(),
    partial: req.query.partial,
    portfolioItems: portfolioItems.map(item => {
      item.src = cache.get('files').media[item.src]
      return item
    })
  })
}
