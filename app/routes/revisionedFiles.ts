// get revisioned files
import { revisionedFiles } from '../services/files'

module.exports = (_req, res) => {
  res.json({
    css: revisionedFiles().css,
    js: revisionedFiles().js
  })
}
