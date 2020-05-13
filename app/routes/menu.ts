import menu from '../templates/newPartials/menu'
const { renderToString } = require('@popeindustries/lit-html-server')

module.exports = async (_req, res) => {
  return res.send(await renderToString(menu(`
    <a href="/">Index</a>
    <a href="/home#about">Resume</a>
    <a href="/blog/">Writing</a>
    <a target="_blank" href="mailto:lukas@vea.re?subject=Hey 👋,%20what&apos;s%20up?&body=Great%20to%20hear%20from%20you,%20how%20can%20I%20help?">Contact</a>
  `)))
}
