require('dotenv-safe').load()

module.exports = {
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_TOKEN
}
