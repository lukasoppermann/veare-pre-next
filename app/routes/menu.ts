import menu from '../templates/newPartials/menu'
const { renderToString } = require('@popeindustries/lit-html-server')

module.exports = async (_req, res) => {
  return res.send(await renderToString(menu('/', true)))
}
