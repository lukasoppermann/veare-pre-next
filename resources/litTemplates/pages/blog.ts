import layout from '../layout'
import preview from '../partials/article-preview'
const { html } = require('@popeindustries/lit-html-server')
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')
const files = require('../../../app/services/files')()
export default (articles) => layout(html`
  <div class="Grid c-blog-Grid--image">
    <div class="o-blog-listing__about">
      <a href="/" data-nav="#nav" class="o-logo">
        <svg class="o-logo__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 141 116"><path class="o-logo__form o-logo__form--white" d="M81.365 13.826l-23.37 46.318L39.73 23.95h100.725L128.37 0H0l58.01 115 51.02-101.174"/><linearGradient id="a" gradientUnits="userSpaceOnUse" x1="75.999" y1="27" x2="103.999" y2="27"><stop offset="0" stop-opacity=".25"/><stop offset="1" stop-opacity=".05"/></linearGradient><path fill="url(#a)" d="M76 24h28l-2.938 6"/></svg>
      </a>
      <lazy-picture
        class="o-blog-listing__image"
        active="true"
        src="/${files.media['media/veare_scooter.jpg']}"
        alt="Lukas Oppermann"
        fit="cover"
      ></lazy-picture>
    </div>
  </div>
  <div class="Grid c-blog-Grid--posts">
    <div class="o-blog-listing__right">
      <ul class="c-list-postlist" itemscope itemtype="http://schema.org/Blog">
        ${repeat(articles, (article) => preview(article))}
      </ul>
    </ul>
  </ul>
`)
