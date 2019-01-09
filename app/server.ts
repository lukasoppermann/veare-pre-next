const contentful = require('./services/contentful')
const app = require('./app')

// server function
let startServer = (defaultPort = '8080') => {
  let port = process.env.PORT || defaultPort
  // start
  app.listen(port)
  if (process.env.NODE_ENV !== 'testing') {
    console.log('Running on http://localhost:' + port + ' environment is set to "' + process.env.NODE_ENV + '"')
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
