const fs = require('fs')
let staticFiles = JSON.parse(fs.readFileSync('public/rev-manifest.json', 'utf8'))

module.exports = (req, res, next) => {
  // add files to request as staticFiles
  req.staticFiles = staticFiles
  next()
}
