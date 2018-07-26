const fs = require('fs')

module.exports = () => {
  let staticFiles = JSON.parse(fs.readFileSync('public/rev-manifest.json', 'utf8'))
  // add files to request as staticFiles
  return (req, res, next) => {
    req.staticFiles = staticFiles
    next()
  }
}
