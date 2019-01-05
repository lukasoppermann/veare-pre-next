const express = require('express')
const app = express()
const hbs = require('./services/expressHandlebars')

// ---------------------------------- //
// Settings
// path to templates
app.set('views', 'resources/templates/pages')
app.engine('hbs', hbs.engine)
// register new view engine
app.set('view engine', 'hbs')
// works with caching
app.set('view cache', true)
// ---------------------------------- //
// MIDDLEWARE
app.use(require('./middleware'))
// ---------------------------------- //
// ROUTES
app.use(require('./routes'))

module.exports = app
