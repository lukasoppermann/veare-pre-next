import { revisionedFiles } from './services/files'
const express = require('express')
const fs = require('fs')
const app = express()

export default async () => {
  // ---------------------------------- //
  // load files into revisioned files
  revisionedFiles(JSON.parse(fs.readFileSync('public/rev-manifest.json', 'utf8')))
  // disabled unneeded headers
  app.set('etag', false)
  app.set('x-powered-by', false)
  // works with caching
  app.set('view cache', false) // should be enabled by default if process.env.NODE_ENV === "production"
  // ---------------------------------- //
  // MIDDLEWARE
  app.use(require('./middleware'))
  // ---------------------------------- //
  // Dev Middleware
  if (process.env.NODE_ENV === 'development') {
    app.use(require('./middleware/dev.ts'))
  }
  // ---------------------------------- //
  // ROUTES
  app.use(require('./routes'))

  return app
}
