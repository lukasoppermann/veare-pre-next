'use strict'

const client = require('../services/client')
const cache = require('memory-cache')
let Transformer
let content
let self

class Model {
  constructor (transformer, contentType) {
    if (!transformer || typeof transformer !== 'function' || !contentType || typeof contentType !== 'string') {
      throw new Error(`'${this.constructor.name}' model can't be initialized, please provide a transformer and the content type.`)
    }
    Transformer = transformer
    content = new Transformer(cache.get(contentType)).get()
  }

  all () {
    return content
  }

  find (id) {
    return content.find((item) => {
      return item.id === id
    })
  }

  findByField (type, key) {
    return content.find((item) => {
      return item.fields[type] === key
    })
  }
}

module.exports = Model
