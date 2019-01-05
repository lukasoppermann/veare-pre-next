// get revisioned files
module.exports = (req, res) => {
  let revisionedFiles = Object.keys(req.staticFiles)
    .filter(key => key.substr(-3) === 'css' || key.substr(-2) === 'js')
    .reduce((obj, key) => {
      obj[key] = req.staticFiles[key]
      return obj
    }, {})
  // return as json
  res.json(revisionedFiles)
}
