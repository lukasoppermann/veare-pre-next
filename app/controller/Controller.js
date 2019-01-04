'use strict'

// App
class Controller {
  render (req, res, view, data = {}) {
    res.render(view, Object.assign({
      staticFiles: req.staticFiles,
      preview: req.query.preview,
      response: res
    }, data))
  }
}

module.exports = Controller
