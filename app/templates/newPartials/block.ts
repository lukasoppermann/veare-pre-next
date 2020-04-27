const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')

export default (fields) => html`
${fields.slug !== null ? unsafeHTML('<a class="link__anchor" name="' + fields.slug + '"></a>') : ''}
<div class="Block Grid ${fields.classes || ''}">
  ${unsafeHTML(fields.content)}
</div>
`
