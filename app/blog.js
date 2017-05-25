'use strict'

const client = require('./client')
const NodeCache = require('node-cache')
const cache = new NodeCache()

class Blog {

  post (req, res) {
    cache.del('catgeories')
    cache.get('catgeories', (err, value) => {
      if (!err) {
        if (value === undefined) {
          client.getEntries({
            content_type: 'category'
          })
          .then((response) => {
            cache.set('catgeories', response.items)
            res.send(response.items)
          })
          .catch((error) => {
            res.send(error)
          })
        } else {
          res.send(value)
        }
      }
    })
  }
}

module.exports = () => new Blog()
