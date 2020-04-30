import cache from './services/cacheService'
const express = require('express')
const app = express()

export default async () => {
  // ---------------------------------- //
  // Add files to cache
  cache().put('files', require('./services/files')())
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
