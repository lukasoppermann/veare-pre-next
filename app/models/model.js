'use strict'

const client = require('../services/client')

class Model {
  constructor (cache, transformer, opts) {
    if (!opts.contentType || !opts.type) {
      throw new Error(`'${this.constructor.name}' model is can't be initialized, options missing.`)
    }
    this.cache = cache
    this.transformer = transformer
    this.contentType = opts.contentType
    this.type = opts.type
  }

  all (cb) {
    let that = this
    return this.cache.get(this.contentType, function (err, data) {
      if (!err) {
        if (data === undefined) {
          let data = that.fetchData(true, (data) => {
            that.cache.set(that.contentType, data)
            console.log('fetchData Callback:',new that.transformer(data.entries).get());
            cb(new that.transformer(data.entries).get())
          })
        } else {
          cb(new that.transformer(data.entries).get())
        }
      }
    })
  }

  fetchData (initial, cb) {
    client.sync({
      initial: initial || false,
      type: this.type,
      content_type: this.contentType
    })
    .then((response) => {
      const responseObj = JSON.parse(response.stringifySafe())
      cb({
        entries: responseObj.entries,
        assets: responseObj.assets,
        nextSyncToken: responseObj.nextSyncToken
      })
    })
    .catch(console.error)
  }
}

module.exports = Model
