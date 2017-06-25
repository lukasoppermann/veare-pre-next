'use strict'

// App
const express = require('express')
const app = express()
const path = require('path')
const hoffman = require('hoffman')

app.set('views', path.join(__dirname, '../../resources/templates')) // path to your templates
app.set('view engine', 'dust')
app.engine('dust', hoffman.__express())

class Controller {

  render (res, view, data = {}) {
    let files = JSON.parse(require('fs').readFileSync('public/rev-manifest.json', 'utf8'))
    Object.keys(files).map(function (key, index) {
      data[key.replace('.', '_').replace(/^[a-z]+\//, '')] = files[key]
    })
    res.render(view, data)
  }

  renderMaster (res, view, data = {}) {
    let self = this
    let files = JSON.parse(require('fs').readFileSync('public/rev-manifest.json', 'utf8'))
    Object.keys(files).map(function (key, index) {
      data[key.replace('.', '_').replace(/^[a-z]+\//, '')] = files[key]
    })
    app.render(view, data, function (err, html) {
      if (!err) {
        self.render(res, 'partials/master', {
          content: html
        })
      } else {
        console.log(err)
      }
    })
  }
}

module.exports = Controller
