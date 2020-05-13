import meta from './meta'
import footer from './newPartials/footer'
import menu from './newPartials/menu'
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
    <body class="${options.bodyClass || ''}${process.env.NODE_ENV === 'test' ? ' testing' : ''}">
      <!-- NEW STUFF -->
      ${menu(`
        <a href="/">Index</a>
        <a href="/home#about">Resume</a>
        <a href="/blog/">Writing</a>
        <a target="_blank" href="mailto:lukas@vea.re?subject=Hey 👋,%20what&apos;s%20up?&body=Great%20to%20hear%20from%20you,%20how%20can%20I%20help?">Contact</a>
      `)}
      <div class="Page ${options.pageClass || ''}">
        ${content || ''}
      </div>
      ${footer}
    </body>
    </html>
`
}
