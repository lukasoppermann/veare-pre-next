// get revisioned files
import files from '../services/files'

module.exports = (_req, res) => {
  res.json({
    css: files().css,
    js: files().js
  })
}
