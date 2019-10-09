import layout from '../layout'
import convertRichText from '../../../app/services/convertRichText'
const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')
// get correct filesnames after appending unique string
const files = require('../../../app/services/files')
// export template
export default (article) => layout(html`
  <h1>${article.fields.title}</h1>
  <div class="Article__publication-details">
      <time class="Article__time" itemprop="datePublished" datetime="${article.fields.rawdate}">${article.fields.date}</time> •&nbsp;
      <time class="Article__read-time" datetime="${article.fields.readingTime}m">${article.fields.readingTime} min read</time>
  </div>

  <div class="Article__author">
    — Published by <span itemprop="author" itemscope itemtype="http://schema.org/Person">
      <a class="author" href="https://twitter.com/lukasoppermann" itemprop="url" title="about ${article.fields.author.fields.name}" rel="author">
        <span itemprop="name">${article.fields.author.fields.name}</span>
      </a></span>
       /
      <span itemprop="publisher" itemtype="http://schema.org/Organization" itemscope>
        <a itemprop="url" href="http://vea.re">
          <span itemprop="name">vea.re</span>
        </a>
      </span> —
  </div>
  ${unsafeHTML(convertRichText(article.fields.content))}
`, {
  bodyClass: 'Page-Type__Article Article',
  head: html`
  <link type="text/css" href="/${files().css['css/blog.css']}" rel="stylesheet" />
  `
})
