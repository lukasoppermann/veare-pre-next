const fs = require('fs')
const memoryCache = require('memory-cache')
let cacheTime = process.env.NODE_ENV === 'development' ? 10 : 604800017

module.exports = (req, res, next) => {
  let staticFiles = memoryCache.get('files')
  if (staticFiles === null) {
    staticFiles = memoryCache.put('files', JSON.parse(fs.readFileSync('public/rev-manifest.json', 'utf8')), cacheTime)
  }
  // add files to request as staticFiles
  req.staticFiles = staticFiles
  next()
}
