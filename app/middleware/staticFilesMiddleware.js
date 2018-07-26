module.exports = (files) => {
  // add files to request as staticFiles
  return (req, res, next) => {
    req.staticFiles = files
    next()
  }
}
