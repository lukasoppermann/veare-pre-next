import progressive from '../templates/pages/progressive'
import homepage from '../templates/pages/homepage'
const { renderToString } = require('@popeindustries/lit-html-server')

module.exports = {
  progressive: async (_req, res) => res.send(await renderToString(progressive())),
  index: async (req, res) => res.send(await renderToString(homepage(req.query.partial)))
}
