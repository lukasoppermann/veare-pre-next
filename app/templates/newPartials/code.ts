const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')

export default (fields) => html`
  <div class="Code__Element">
    <div class="Code__Element__file-or-path">${fields.fileOrPath}</div>
    <pre><code class="language-${fields.language}">${unsafeHTML(fields.code)}</code></pre>
  </div>
`
