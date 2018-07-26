'use strict'

// App
class Controller {
  render (req, res, view, data = {}) {
    res.render(view, Object.assign({
      staticFiles: req.staticFiles,
      preview: req.query.preview
    }, data))
  }
}

module.exports = Controller
