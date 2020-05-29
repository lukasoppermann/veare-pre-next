import layout from '../layout'
import preview from '../partials/article_preview'
import { revFile } from '../../services/files'
import { templateInterface } from '../../../types/template'
const { html } = require('@popeindustries/lit-html-server')
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')
// get correct filesnames after appending unique string
export default (articles, req): templateInterface => layout(html`
  <ul class="Article-list Grid" itemscope itemtype="http://schema.org/Blog">
    ${repeat(articles, (article) => preview(article))}
    <li class="Article__more_on_medium Article__preview">
      <a href="https://medium.com/@lukasoppermann" target="_blank">More articles on medium</a>
    </li>
  </ul>
`, {
  head: html`
  <link type="text/css" href="/${revFile('css/blog.css')}" rel="stylesheet" />
  `,
  pageClass: 'Page__blog'
}, req)
