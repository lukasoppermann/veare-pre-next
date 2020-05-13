import menu from '../templates/partials/menu'
const { renderToString } = require('@popeindustries/lit-html-server')

module.exports = async (_req, res) => {
  return res.send(await renderToString(menu))
}
