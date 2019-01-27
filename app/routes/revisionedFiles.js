// get revisioned files
module.exports = (req, res) => {
  res.json({
    css: req.app.locals.files.css,
    js: req.app.locals.files.js
  })
}
