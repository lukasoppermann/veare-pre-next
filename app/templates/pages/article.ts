// get correct filesnames after appending unique string
import { revFile } from '../../services/files'
import layout from '../layout'
import { templateInterface } from '../../../types/template'
const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')
// export template
export default (article, req): templateInterface => layout(html`
  <div class="Article Grid">
    <h1>${article.title}</h1>
    <div class="Article__publication-details">
        <time class="Article__time" itemprop="datePublished" datetime="${article.rawdate}">${article.date}</time> •&nbsp;
        <time class="Article__read-time" datetime="${article.readingTime}m">${article.readingTime} min read</time>
    </div>

    <div class="Article__author">
        — Published by <span itemprop="author" itemscope itemtype="http://schema.org/Person">
          <a class="author" href="https://twitter.com/lukasoppermann" itemprop="url" title="Twitter account of Lukas Oppermann" rel="author">
            <span itemprop="name">Lukas Oppermann</span></a></span> /
        <span itemprop="publisher" itemtype="http://schema.org/Organization" itemscope>
          <a itemprop="url" href="http://vea.re">
            <span itemprop="name">vea.re</span>
          </a>
        </span>
    </div>

  ${unsafeHTML(article.content)}

    <a class="Article__back_link" href="/blog">← Back</a>
  </div>
`, {
  bodyClass: 'Page-Type__Article',
  head: html`
  <link type="text/css" href="/${revFile('css/blog.css')}" rel="stylesheet" />
  `
}, req)
