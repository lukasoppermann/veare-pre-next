import layout from '../layout'
import { templateInterface } from '../../../types/template'
const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')

export default (page, req): templateInterface => layout(html`
  <div class="Page Page__${page.slug}" slug="${req.path}">
    ${unsafeHTML(page.content)}
  </div>
`, {
  bodyClass: page.slug,
  pageUnwrap: true
}, req)
