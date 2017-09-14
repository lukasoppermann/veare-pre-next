'use strict'

// App
class Controller {
  render (res, view, data = {}) {
    res.render(view, data)
  }
}

module.exports = Controller
