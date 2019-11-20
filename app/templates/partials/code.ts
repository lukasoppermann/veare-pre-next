const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')

export default (item) => html`
  <div class="Code__Element">
    <div class="Code__Element__file-or-path">${item.fileOrPath}</div>
    <pre><code class="language-${item.language}">${unsafeHTML(item.code)}</code></pre>
  </div>
`
