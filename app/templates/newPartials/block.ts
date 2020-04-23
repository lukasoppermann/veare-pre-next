const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')

export default (fields) => html`
<div class="Block Grid ${fields.classes || ''}">
  ${fields.slug !== null ? unsafeHTML('<a class="link__anchor" name="' + fields.slug + '"></a>') : ''}
  ${unsafeHTML(fields.content)}
</div>
`
