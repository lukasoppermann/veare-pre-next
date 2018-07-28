const fs = require('fs')

module.exports = () => {
  return (req, res, next) => {
    let files = JSON.parse(fs.readFileSync('public/rev-manifest.json', 'utf8'))
    Object.keys(files)
      .filter(key => key.substr(-3) === 'css' || key.substr(-2) === 'js')
      .reduce((obj, key) => {
        req.staticFiles[key] = files[key]
        return obj
      }, {})
    next()
  }
}
