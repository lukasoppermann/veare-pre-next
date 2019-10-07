import meta from './meta'
import footer from './partials/footer'
import menu from './partials/menu'
const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')
// get correct filesnames after appending unique string
const files = require('../../app/services/files')()
// read file to inline directly into template
const indexjs = require('fs').readFileSync('./public/' + files.js['js/index.js'])
//
// ${typeof options.head === 'object' ? html`${options.head}` : ''}
export default (content: string, options: { [prop: string]: string; } = {}) => html`
<!DOCTYPE html>
<html lang="en">
<head>
  ${meta()}
  <script>${unsafeHTML(indexjs)}
  </script>
  ${options.head || ''}
</head>
<body class="${typeof options.bodyClass !== 'undefined' ? options.bodyClass : ''} temp-body">
  ${menu}
  <div id="page" class="Grid">
    ${content || ''}
  </div>
  ${footer}
</body>
</html>
`
