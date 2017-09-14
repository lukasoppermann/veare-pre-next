require('dotenv-safe').load()

// login for contentful client
module.exports = {
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_TOKEN,
  webhookUser: process.env.CONTENTFUL_HOOK_USER,
  webhookPassword: process.env.CONTENTFUL_HOOK_PW
}
