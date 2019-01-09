const app = require('./app.js')
const contentful = require('./services/contentful')

const startServer = () => {
  console.log('✅ Listening on http://localhost:8080')
  app.listen('8080')
}
// contentful has loaded
contentful(startServer, (error) => {
  console.log(`🚨 \x1b[31mError: ${error.code} when trying to connect to ${error.hostname}\x1b[0m`)
  // run routes even when contentful connection fails
  startServer()
})
