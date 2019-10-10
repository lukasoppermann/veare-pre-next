const express = require('express')
const app = express()
const hbs = require('./services/expressHandlebars')
// ---------------------------------- //
// Add files to cache & app locals
app.locals.files = require('./services/files')()
// path to templates
app.set('views', 'resources/templates/pages')
app.engine('hbs', hbs.engine)
// register new view engine
app.set('view engine', 'hbs')
// works with caching
// app.set('view cache', true) // should be enabled by default if process.env.NODE_ENV === "production"
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

module.exports = app
