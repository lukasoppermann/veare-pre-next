import contentful from './services/contentful'

const Greenlock = require('greenlock-express')
const letsencryptConfig = require('./config/letsencrypt')
const startServer = async () => {
  const app = await require('./app.js')()
  const greenlock = Greenlock.create(Object.assign(letsencryptConfig, { app: app }))
  // development server
  if (process.env.NODE_ENV === 'development') {
    console.info('\u001b[36m############################ Reloaded ############################\u001b[0m')
    console.info('Environment: ' + process.env.NODE_ENV)
    console.info('✅ Listening on http://localhost:8080')
    app.listen('8080')
  } else if (process.env.NODE_ENV === 'test') {
    app.listen(process.env.NODE_PORT || '3300')
  } else {
    // live server server
    greenlock.listen(80, 443)
  }
}

try {
  // get content from contentful & run transformers
  contentful()
  // start server
    .then(startServer())
} catch (error) {
  // catch & print error
  console.error(`🚨 \x1b[31mError: ${error.code} when trying to connect to ${error.hostname}\x1b[0m`, error)
  console.error(error)
  // try to start server anyway
  startServer()
}
