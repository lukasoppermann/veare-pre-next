import { middleware } from '../../types/middleware'
import { revisionedFiles } from '../services/files'

const revisionFiles: middleware = (_req, res) => {
  // set header to json format
  res.setHeader('Content-Type', 'application/json')
  // return json strinf
  res.end(JSON.stringify({
    css: revisionedFiles().css,
    js: revisionedFiles().js
  }))
}

export default revisionFiles
