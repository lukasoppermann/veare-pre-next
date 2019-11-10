// get revisioned files
const cache = require('../services/cacheService')()

module.exports = (_req, res) => {
  res.json({
    css: cache.get('files').css,
    js: cache.get('files').js
  })
}
