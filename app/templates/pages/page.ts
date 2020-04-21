import layout from '../layout'
import { templateInterface } from '../../../types/template'
const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')

export default (page, _req): templateInterface => layout(html`
  ${unsafeHTML(page.content)}
`, {
  bodyClass: page.slug
})
