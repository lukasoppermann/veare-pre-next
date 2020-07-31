import contentful from './services/contentful'
import config from './config/contentful'
import { fastifyApp } from './app'

const env = process.env.NODE_ENV || 'development'
const online = require('dns-sync').resolve(config.host[env])

const startServer = async () => {
  // ------------------------
  // development server
  // ------------------------
  if (env === 'development') {
    const app = await fastifyApp()
    console.info('\u001b[36m############################ Reloaded ############################\u001b[0m')
    console.info('Environment: ' + process.env.NODE_ENV)
    console.info('✅ Listening on http://localhost:8080')
    app.listen('8080')
  // ------------------------
  // TEST server
  // ------------------------
  } else if (env === 'test') {
    const app = await fastifyApp()
    app.listen('3300')
  // ------------------------
  // live server server
  // ------------------------
  } else {
    // fastify function with greenlock http2 server
    const fastifyServer = async (glx) => {
      // init fastify app with server factory
      const fastify = await fastifyApp({
        serverFactory: handler => glx.http2Server(null, (req, res) => {
          handler(req, res)
        })
      })
      // listen to https port
      fastify.listen(443, '0.0.0.0')

      const httpServer = glx.httpServer()
      httpServer.listen(80, '0.0.0.0', () => {
        console.info('Listening on ', httpServer.address())
      })
    }

    require('greenlock-express')
      .init({
        // path.join(__dirname, '/../')
        packageRoot: require('path').join(__dirname, '/../'),
        // contact for security and critical bug notices
        maintainerEmail: 'oppermann.lukas@gmail.com',
        // where to look for configuration
        // config file is uploded here via capistrano from config/greenlock-config.json
        configDir: process.env.GREENLOCK_CONFIG || './../../shared/greenlock.d',
        // whether or not to run at cloudscale
        cluster: false
      })
      // Serves on 80 and 443
      // Get's SSL certificates magically!
      // .serve(app)
      .ready(fastifyServer)
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
