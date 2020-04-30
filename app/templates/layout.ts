import meta from './meta'
import footer from './partials/footer'
import menu from './partials/menu'
const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')
// get correct filesnames after appending unique string
const files = require('../services/files')
const fs = require('fs')
//
export default (content: string, options: { [prop: string]: any; } = {}, partial: string = 'false') => {
  if (partial === 'true') {
    return html`${content}`
  }
  return html`
    <!DOCTYPE html>
    <html lang="en" prefix="og: http://ogp.me/ns#">
    <head>
      ${meta(options.title || undefined, options.og || [])}
      <link type="text/css" href="/${files().css['css/litApp.css']}" rel="stylesheet" />
      <link type="text/css" href="/${files().css['css/app.css']}" rel="stylesheet" />
      <script>${unsafeHTML(fs.readFileSync('./public/' + files().js['js/index.js']))}
      </script>

      ${options.head || ''}
    </head>
    <body class="${options.bodyClass || ''} temp-body">
      <!-- NEW STUFF -->
      <div class="Page">
        <menu class="responsive-menu">
          ${menu}
        </menu>
        ${content || ''}
      </div>
      ${footer}
    </body>
    </html>
`
}
