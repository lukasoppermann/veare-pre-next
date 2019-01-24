const fs = require('fs')
const memoryCache = require('memory-cache')
let cacheTime = process.env.NODE_ENV === 'development' ? 10 : 604800017

module.exports = (req, res, next) => {
  let staticFiles = memoryCache.get('staticFiles')
  let files = memoryCache.get('files')
  if (staticFiles === null || files === null) {
    let revFiles = JSON.parse(fs.readFileSync('public/rev-manifest.json', 'utf8'))
    files = {
      css: {},
      js: {},
      media: {}
    }
    Object.keys(revFiles).map(key => {
      files[key.slice(0, key.indexOf('/'))][key] = revFiles[key]
    })
    staticFiles = memoryCache.put('staticFiles', revFiles, cacheTime)
    files = memoryCache.put('files', files, cacheTime)
  }
  // add files to request as staticFiles
  req.staticFiles = staticFiles
  req.files = files
  next()
}
