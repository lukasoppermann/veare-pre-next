import meta from '../meta'
import headerIntro from '../partials/header_intro'
const cache = require('../../services/cacheService')()
const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')
const fs = require('fs')
const path = require('path')

export default html`
<!DOCTYPE html>
<html lang="en">
<head>
  ${meta('& Creative Direction – Lukas Oppermann')}
  <style>
    ${unsafeHTML(fs.readFileSync(path.resolve(__dirname, '../../../public/' + cache.get('files').css['css/slim.css'])))}
  </style>
  <script>
    ${unsafeHTML(fs.readFileSync(path.resolve(__dirname, '../../../public/' + cache.get('files').js['js/appNamespace.js'])))}
    app.files = {
      js: ${unsafeHTML(JSON.stringify(cache.get('files').js))},
      css: ${unsafeHTML(JSON.stringify(cache.get('files').css))}
    }
    ${unsafeHTML(fs.readFileSync(path.resolve(__dirname, '../../../public/' + cache.get('files').js['js/frontend.js'])))}
  </script>
  </head>
  <body>
    <menu></menu>
      ${headerIntro}
    <main>
    </main>
    <footer>
    </footer>
  </body>
  </html>
`
