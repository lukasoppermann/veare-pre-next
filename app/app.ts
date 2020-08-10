import { revisionedFiles } from './services/files'
import helmetSettings from './config/helmet-settings'
import routes from './routes/routes'
const connect = require('connect')
const fs = require('fs')
const app = connect()
// middleware
const compression = require('compression')
const hemlet = require('helmet')
const serveStatic = require('serve-static')
const bodyParser = require('body-parser')

export default () => {
  // ---------------------------------- //
  // load files into revisioned files
  revisionedFiles(JSON.parse(fs.readFileSync('public/rev-manifest.json', 'utf8')))
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
