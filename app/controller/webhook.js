'use strict'

const Contentful = require('../services/contentful')

class Webhook {
  constructor (cache) {
    this.cache = cache
  }

  _authenticate () {
    // use environement variables for password
    return true
  }

  fire (req, res) {
    // abort if authentication is wrong
    if (!this._authenticate()) return
    // refresh content
    const contentful = new Contentful(this.cache)
    contentful.sync()
  }
}

module.exports = Webhook
