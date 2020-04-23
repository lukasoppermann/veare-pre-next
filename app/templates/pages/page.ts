import layout from '../layout'
import { templateInterface } from '../../../types/template'
const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')

export default (page): templateInterface => layout(html`
  <section class="Grid">
    ${unsafeHTML(page.content)}
  </section>
`, {
  bodyClass: page.slug
})
