const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')

export default (item) => html`
<div class="Text__Element Text__Element--${item.textType} SectionType__textSection ${'SectionType__' + item.type + '--' + item.textType}">
  ${unsafeHTML(item.text)}
</div>
`
