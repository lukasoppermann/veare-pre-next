const PageModel = require('../models/Page')()

module.exports = (req, res, slug = 'home', view = 'page') => {
  res.render(view || 'page', {
    page: PageModel.findBySlug(slug).fields,
    pageClass: slug
  })
}
