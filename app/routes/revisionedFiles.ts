// get revisioned files
import cache from '../services/cacheService'

module.exports = (_req, res) => {
  res.json({
    css: cache().get('files').css,
    js: cache().get('files').js
  })
}
