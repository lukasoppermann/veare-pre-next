'use strict'

// App
class Controller {
  render (req, res, view, data = {}) {
    res.render(view, data)
  }
}

module.exports = Controller
