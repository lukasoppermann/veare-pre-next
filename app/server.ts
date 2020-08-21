import contentful from './services/contentful'
import config from './config/contentful'
import makeApp from './app'
const http = require('http')
const http2 = require('http2')
const fs = require('fs')
const env = process.env.NODE_ENV || 'development'
const online = require('dns-sync').resolve(config.host[env])

const startServer = async () => {
  const app = await makeApp()

  const httpsWorker = glx => {
    // Get the raw http2 server:
    const tlsOptions = null
    const http2Server = glx.http2Server(tlsOptions, app)

    http2Server.listen(443, '0.0.0.0', () => {
      console.debug(http2Server.address())
      console.info('Listening on', http2Server.address())
    })

    // Note:
    // You must ALSO listen on port 80 for ACME HTTP-01 Challenges
    // (the ACME and http->https middleware are loaded by glx.httpServer)
    const httpServer = glx.httpServer()

    httpServer.listen(80, '0.0.0.0', () => {
      console.info('Listening on', httpServer.address())
    })
  }
  // ------------------------
  // development server
  // ------------------------
  if (env === 'development') {
    console.info('\u001b[36m############################ Reloaded ############################\u001b[0m')
    console.info('Environment: ' + process.env.NODE_ENV)
    console.info('✅ Listening on https://localhost:8080')
    // app.listen('8080')
    http2.createSecureServer({
      key: fs.readFileSync('./_certs/localhost-key.pem'),
      cert: fs.readFileSync('./_certs/localhost.pem')
    }, app).listen('8080')
  // ------------------------
  // TEST server
  // ------------------------
  } else if (env === 'test') {
    console.info('\u001b[36m############################ Running tests ############################\u001b[0m')
    console.info('Environment: ' + process.env.NODE_ENV)
    // app.listen('3300')
    http.createServer(app).listen('3300')
  // ------------------------
  // live server server
  // ------------------------
  } else {
    require('greenlock-express')
      .init({
        // path.join(__dirname, '/../')
        packageRoot: require('path').join(__dirname, '/../'),
        // contact for security and critical bug notices
        maintainerEmail: 'oppermann.lukas@gmail.com',
        // where to look for configuration
        configDir: './../../shared/greenlock.d',
        // whether or not to run at cloudscale
        cluster: false
      })
      // Serves on 80 and 443
      // Get's SSL certificates magically!
      .serve(httpsWorker)
  }
}

try {
  if (online !== null) {
    // get content from contentful & run transformers
    contentful()
    // start server
      .then(() => startServer())
  } else {
    startServer()
  }
} catch (error) {
  // catch & print error
  console.error(`🚨 \x1b[31mError: ${error.code} when trying to connect to ${error.hostname}\x1b[0m`, error)
  console.error(error)
  // try to start server anyway
  startServer()
}
