const contentful = require('./services/contentful')
const app = require('./app')

// server function
let startServer = (defaultPort = '8080', defaultHostname = 'localhost') => {
  let port = process.env.NODE_PORT || defaultPort
  let hostname = process.env.NODE_HOST || defaultHostname
  // start
  app.listen(port, hostname)
  if (process.env.NODE_ENV !== 'testing') {
    console.log(`Running on http://${hostname}:${port} environment is set to "${process.env.NODE_ENV}"`)
  }
}

// contentful has loaded
contentful(startServer, (error) => {
  console.log('error: ' + error.errno + ' ----')
  if (error.Error !== undefined) {
    console.error(error.Error)
  } else {
    console.error(error)
  }
  // run routes even when contentful connection fails
  startServer()
})
