'use strict'

// App
class Controller {
  render (req, res, view, data = {}) {
    res.render(view, Object.assign({
      staticFiles: req.staticFiles
    }, data))
  }
}

module.exports = Controller
