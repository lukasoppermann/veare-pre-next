require('dotenv-safe').config()

// login for contentful client
module.exports = {
  space: process.env.CONTENTFUL_SPACE,
  accessToken: {
    development: process.env.CONTENTFUL_TOKEN_PREVIEW,
    production: process.env.CONTENTFUL_TOKEN,
    testing: process.env.CONTENTFUL_TOKEN
  },
  webhookUser: process.env.CONTENTFUL_HOOK_USER,
  webhookPassword: process.env.CONTENTFUL_HOOK_PW,
  host: {
    development: 'preview.contentful.com',
    production: 'cdn.contentful.com',
    testing: 'cdn.contentful.com'
  }
}
