import progressive from '../../resources/litTemplates/pages/progressive'
import homepage from '../../resources/litTemplates/pages/homepage'
const ProjectModel = require('../models/Project')()
const PageModel = require('../models/Page')()
const fs = require('fs')
const { renderToString } = require('@popeindustries/lit-html-server')
const portfolioItems = JSON.parse(fs.readFileSync('resources/templates/data/portfolio.json'))
const cache = require('../services/cacheService')()

module.exports = {
  progressive: async (_req, res) => res.send(await renderToString(progressive)),
  index: async (req, res) => res.send(await renderToString(homepage(PageModel.findBySlug('home').fields, req.query.partial))),
  indexOld: (req, res) => {
    console.log(PageModel.findBySlug('home').fields)
    res.render('index', {
      ...{
        page: PageModel.findBySlug('home').fields,
        pageClass: 'home',
        projects: ProjectModel.all(),
        partial: req.query.partial,
        portfolioItems: portfolioItems.map(item => {
          item.src = cache.get('files').media[item.src]
          return item
        })
      }
    })
  }
}
