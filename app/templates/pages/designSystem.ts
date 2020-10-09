import layout from '../layout'
import { templateInterface } from '../../../types/template'
const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')

export default (page, req): templateInterface => layout(html`
  <main class="Page__${page.slug}" slug="${req.path}">
    <h1>${page.title}</h1>
    <time class="Page__lastupdated" itemprop="datePublished" datetime="${page.rawLastIteration}">${page.lastIteration}</time>
    ${unsafeHTML(page.content)}

    <h1>Design System</h1>
    <h2>Design System</h2>
    <h3>Design System</h3>
    <h4>Design System</h4>
    <h5>Design System</h5>
    <h6>Design System</h6>
  </main>
`, {
  description: page.description,
  bodyClass: page.slug
}, req)
