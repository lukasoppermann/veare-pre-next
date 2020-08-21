import { revisionedFiles } from '../services/files'
const fs = require('fs')

export default (_req, _res, next) => {
  console.debug('Running dev middleware')
  // update files
  revisionedFiles(JSON.parse(fs.readFileSync('public/rev-manifest.json', 'utf8')))
  // call next middleware
  next()
}
