const { html } = require('@popeindustries/lit-html-server')
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')

export default (item) => html`
<div class="Boxed-group Grid--columns">
  ${repeat(item.items, (item) => unsafeHTML(`
    <div class="Boxed-item" style="flex-grow: ${item.optionalParameter}">
      <span class="Headline--h5 text--light">${item.key}</span>
      <div class="Paragraph Paragraph--sans-small">
        ${item.value}
      </div>
    </div>
  `))}
</div>
`
