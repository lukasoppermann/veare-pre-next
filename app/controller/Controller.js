'use strict'


class Controller {

  render (res, view, data = {}) {
    let files = JSON.parse(require('fs').readFileSync('public/rev-manifest.json', 'utf8'))
    Object.keys(files).map(function (key, index) {
      data[key.replace('.', '_').replace(/^[a-z]+\//, '')] = files[key]
    })

    res.render(view, data)
  }
}

module.exports = Controller
