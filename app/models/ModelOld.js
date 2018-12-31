const cache = require('../services/cacheService')()

class Model {
  constructor (transformer, type) {
    if (!transformer || typeof transformer !== 'function' || !type || typeof type !== 'string') {
      throw new Error(`'${this.constructor.name}' model can't be initialized, please provide a transformer and the content type.`)
    }
    this.contentType = type
    this.Transformer = transformer
  }

  content () {
    return new this.Transformer(cache.get(this.contentType)).all()
  }

  all () {
    return this.content()
  }

  find (id) {
    return this.content().find((item) => {
      return item.id === id
    })
  }

  findByField (type, value) {
    return this.content().find((item) => {
      return item.fields[type] === value
    })
  }

  findByArrayField (type, value) {
    return this.content().find((item) => {
      return item.fields[type] !== undefined && item.fields[type] !== null && item.fields[type].indexOf(value) > -1
    })
  }
}
module.exports = Model
