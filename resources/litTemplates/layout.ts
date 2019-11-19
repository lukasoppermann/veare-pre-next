import meta from './meta'
import footer from './partials/footer'
import menu from './partials/menu'
const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')
// get correct filesnames after appending unique string
const files = require('../../app/services/files')
const fs = require('fs')
//
export default (content: string, options: { [prop: string]: string; } = {}, partial: string = 'false') => {
  if (partial === 'true') {
    return html`${content}`
  }
  return html`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      ${meta(options.title || undefined)}
      <link type="text/css" href="/${files().css['css/litApp.css']}" rel="stylesheet" />
      <link type="text/css" href="/${files().css['css/app.css']}" rel="stylesheet" />
      <script>${unsafeHTML(fs.readFileSync('./public/' + files().js['js/index.js']))}
      </script>

      ${options.head || ''}
    </head>
    <body class="${options.bodyClass || ''} temp-body">
      <!-- NEW STUFF -->
      <!-- <div id="page" class="Grid"> -->
      <div class="Page">
        ${menu}
        ${content || ''}
      </div>
      ${footer}
    </body>
    </html>
`
}
