require('dotenv-safe').load()
// login for contentful client
module.exports = {
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_TOKEN
}
