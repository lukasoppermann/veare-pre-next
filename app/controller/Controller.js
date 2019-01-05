'use strict'

// App
class Controller {
  render (req, res, view, data = {}) {
    res.render(view, Object.assign({
      staticFiles: req.staticFiles,
      response: res
    }, data))
  }
}

module.exports = Controller
