'use strict'

const client = require('../services/client')
const cache = require('memory-cache')
let self

class Model {
  constructor (transformer, opts) {
    if (!opts.contentType || !opts.type) {
      throw new Error(`'${this.constructor.name}' model is can't be initialized, options missing.`)
    }
    this.transformer = transformer
    this.contentType = opts.contentType
    this.type = opts.type
    self = this
  }

  all (cb) {
    let data = cache.get(this.contentType)

    if (data === null) {
      self.fetchData(true, (data) => {
        cache.put(self.contentType, data)
        cb(new self.transformer(data.entries).get())
      })
    } else {
      cb(new self.transformer(data.entries).get())
    }
    // return this.cache.get(this.contentType, function (err, data) {
    //   if (!err) {
    //     if (data === undefined) {
    //       self.fetchData(true, (data) => {
    //         self.cache.set(self.contentType, data)
    //         cb(new self.transformer(data.entries).get())
    //       })
    //     } else {
    //       cb(new self.transformer(data.entries).get())
    //     }
    //   }
    // })
  }

  find (id, cb) {
    let data = cache.get(this.contentType)

    if (data === null) {
      self.fetchData(true, (data) => {
        cache.put(self.contentType, data)
        let items = new self.transformer(data.entries).get()
        let item = items.find((item) => {
          return item['id'] === id
        })
        cb(item)
      })
    } else {
      let items = new self.transformer(data.entries).get()
      let item = items.find((item) => {
        return item['id'] === id
      })
      cb(item)
    }
  }

  findByField (type, key, cb) {
    let data = cache.get(this.contentType)

    if (data === null) {
      self.fetchData(true, (data) => {
        cache.put(self.contentType, data)
        let items = new self.transformer(data.entries).get()
        let item = items.find((item) => {
          return item.fields[type] === key
        })
        cb(item)
      })
    } else {
      let items = new self.transformer(data.entries).get()
      let item = items.find((item) => {
        return item.fields[type] === key
      })
      cb(item)
    }
    // return this.cache.get(this.contentType, function (err, data) {
    //   if (!err) {
    //     if (data === undefined) {
    //       self.fetchData(true, (data) => {
    //         self.cache.set(self.contentType, data)
    //         let items = new self.transformer(data.entries).get()
    //         let item = items.find((item) => {
    //           return item.fields[type] === key
    //         })
    //         cb(item)
    //       })
    //     } else {
    //       let items = new self.transformer(data.entries).get()
    //       let item = items.find((item) => {
    //         return item.fields[type] === key
    //       })
    //       cb(item)
    //     }
    //   }
    // })
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
