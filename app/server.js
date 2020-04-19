const Greenlock = require('greenlock-express')

const contentful = require('./services/contentful')
const letsencryptConfig = require('./config/letsencrypt')
const startServer = async () => {
  const app = await require('./app.js')()
  const greenlock = Greenlock.create(Object.assign(letsencryptConfig, { app: app }))
  // development server
  if (process.env.NODE_ENV === 'development') {
    console.log('\033[36m############################ Reloaded ############################\033[0m')
    console.log('Environment: ' + process.env.NODE_ENV)
    console.log('✅ Listening on http://localhost:8080')
    app.listen('8080')
  } else if (process.env.NODE_ENV === 'test') {
    app.listen(process.env.NODE_PORT || '3300')
  } else {
    // live server server
    greenlock.listen(80, 443)
  }
}

// contentful has loaded
contentful(startServer, (error) => {
  console.log(`🚨 \x1b[31mError: ${error.code} when trying to connect to ${error.hostname}\x1b[0m`)
  // run routes even when contentful connection fails
  startServer()
})
