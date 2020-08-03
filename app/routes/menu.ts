import { middleware } from '../../types/middleware'
import menu from '../templates/newPartials/menu'
const { renderToString } = require('@popeindustries/lit-html-server')

const menuRoute: middleware = async (_req, res) => {
  // set header format
  res.setHeader('Content-Type', 'text/html')
  // return content
  return res.end(await renderToString(menu('/', true)))
}

export default menuRoute
