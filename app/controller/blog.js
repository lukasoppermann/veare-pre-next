'use strict'

let cache

class Blog {

  constructor (globalCache) {
    cache = globalCache
  }

  index (req, res) {
    res.send(cache.get('contentfulEntries'))
  }

  categories (req, res) {
    res.writeHeader(200, {"Content-Type": "text/html"})
        res.write('<body>üos</body>')
        res.end()
  }

  // categories (req, res) {
  //   cache.get('categories', (err, value) => {
  //     if (!err) {
  //       if (value === undefined) {
  //         client.getEntries({
  //           content_type: 'category'
  //         })
  //         .then((response) => {
  //           cache.set('categories', response)
  //           res.send(response.items)
  //         })
  //         .catch((error) => {
  //           res.send(error)
  //         })
  //       } else {
  //         res.send(value.items)
  //       }
  //     }
  //   })
  // }

}

module.exports = Blog
