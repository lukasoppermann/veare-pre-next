/* istanbul ignore file */
import config from '../config/contentful'
const contentful = require('contentful')

const env: string = process.env.NODE_ENV || 'development'

export default contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: config.space,
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: config.accessToken[env],
  host: config.host[env],
  retryOnError: env !== 'production'
})
