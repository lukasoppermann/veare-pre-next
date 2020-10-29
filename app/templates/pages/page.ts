import layout from '../layout'
import { templateInterface } from '../../../types/template'
import { transformedPageFields } from '../../../types/transformer'
import { requestInterface } from '../../../types/request'
const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')

export default (page: transformedPageFields, req: requestInterface): templateInterface => layout(html`
  <main class="Page__${page.slug}" slug="${req.path}">
    <time class="Page__lastupdated" itemprop="datePublished" datetime="${page.rawLastIteration}">${page.lastIteration}</time>
    ${unsafeHTML(page.content)}
  </main>
`, {
  title: page.title,
  description: page.description,
  bodyClass: page.slug
}, req)
