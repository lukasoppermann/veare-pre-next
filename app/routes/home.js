const ProjectModel = require('../models/Project')()
const Pages = require('../controller/Pages')()
const fs = require('fs')
const portfolioItems = JSON.parse(fs.readFileSync('resources/templates/data/portfolio.json'))

module.exports = (req, res) => Pages.get('home', req, res, {
  projects: ProjectModel.all(),
  portfolioItems: portfolioItems.map(item => {
    item.src = req.staticFiles[item.src]
    return item
  })
}, 'index')
