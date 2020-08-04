import { revisionedFiles } from './services/files'
import helmetSettings from './config/helmet-settings'
import routes from './routes/routes'
const express = require('express')
const fs = require('fs')
const app = express()
// middleware
const compression = require('compression')
const hemlet = require('helmet')
const serveStatic = require('serve-static')
const bodyParser = require('body-parser')

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
  app.use(bodyParser.json({ type: 'application/*+json' }))
  app.use(compression())
  app.use(hemlet(helmetSettings))
  app.use(serveStatic('public', { maxAge: '365d', etag: false }))
  // ---------------------------------- //
  // Dev Middleware
  if (process.env.NODE_ENV === 'development') {
    app.use(require('./middleware/dev.ts'))
  }
  // ---------------------------------- //
  // ROUTES
  app.use(routes)

  return app
}
