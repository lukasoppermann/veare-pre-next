const contentful = require('contentful')
const config = require('../config/contentful.js')

const env = (process.env.NODE_ENV || 'development')

const retryOnError = () => {
  if (env !== 'production') {
    return false
  }
  return true
}
const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: config.space,
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: config.accessToken[env],
  host: config.host[env],
  retryOnError: retryOnError()
})

module.exports = client
