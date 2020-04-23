import progressive from '../templates/pages/progressive'
const { renderToString } = require('@popeindustries/lit-html-server')

module.exports = {
  progressive: async (_req, res) => res.send(await renderToString(progressive()))
}
