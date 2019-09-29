import meta from './meta'
const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')
// get correct filesnames after appending unique string
const files = require('../../app/services/files')()
// read file to inline directly into template
const indexjs = require('fs').readFileSync('./public/' + files.js['js/index.js'])
export default (content, options?) => html`
<!DOCTYPE html>
<html lang="en">
<head>
  ${meta()}
  <script>${unsafeHTML(indexjs)}
  </script>
  <link type="text/css" href="/${files.css['css/app.css']}" rel="stylesheet" />
  ${options.head || ''}
</head>
<body class="${options.bodyClass} temp-body">
  <div id="page">
    ${content || ''}
  </div>
</body>
</html>
`
