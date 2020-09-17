import layout from '../layout'
import { templateInterface } from '../../../types/template'
const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')

export default (page, req): templateInterface => layout(html`
  <main class="Page__${page.slug}" slug="${req.path}">
    ${unsafeHTML(page.content)}
</main>
`, {
  description: page.description,
  bodyClass: page.slug
}, req)
