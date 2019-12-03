const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')

export default (code, language, fileOrPath) => html`
  <div class="Code__Element">
    <div class="Code__Element__file-or-path">${fileOrPath}</div>
    <pre><code class="language-${language}">${unsafeHTML(code)}</code></pre>
  </div>
`
