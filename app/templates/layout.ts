import meta from './meta'
import { revFile, embedFile } from '../services/files'
import footer from './newPartials/footer'
import menu from './newPartials/menu'
const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')

export default (content: string, options: { [prop: string]: any; } = {}, req?) => {
  if (req.parameters.partial === 'true') {
    return html`${content}`
  }
  return html`
    <!DOCTYPE html>
    <html lang="en" prefix="og: http://ogp.me/ns#">
    <head>
      ${meta(options.title || undefined, options.og || [])}
      <link type="text/css" href="/${revFile('css/app.css')}" rel="stylesheet" />
      <link rel="preconnect" href="http://images.ctfassets.net" crossorigin>
      <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
      <script>${unsafeHTML(embedFile('./public/' + revFile('js/index.js')))}
      </script>
      ${options.head || ''}
    </head>
    <body class="${options.bodyClass || ''}${process.env.NODE_ENV === 'test' ? ' testing' : ''}">
      <!-- NEW STUFF -->
      ${menu(req.path)}
      ${options.pageUnwrap !== true ? html`<div class="Page ${options.pageClass || ''}" slug="${req.path}">` : ''}
        ${content || ''}
        ${options.pageUnwrap !== true ? html`</div>` : ''}
      ${footer()}
    </body>
    </html>
`
}
