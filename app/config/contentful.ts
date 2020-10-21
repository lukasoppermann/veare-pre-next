// const envPath = process.env.NODE_ENV !== 'production' ? './.env' : '/home/shared/.env'
// this loads the .env config file so that it is available
require('dotenv-safe').config({
  path: './.env'
})
// login for contentful client
export default {
  space: process.env.CONTENTFUL_SPACE,
  accessToken: {
    development: process.env.CONTENTFUL_TOKEN_PREVIEW,
    production: process.env.CONTENTFUL_TOKEN,
    test: process.env.CONTENTFUL_TOKEN_PREVIEW
  },
  webhookUser: process.env.CONTENTFUL_HOOK_USER,
  webhookPassword: process.env.CONTENTFUL_HOOK_PW,
  host: {
    development: 'preview.contentful.com',
    production: 'cdn.contentful.com',
    test: 'preview.contentful.com'
  }
}
