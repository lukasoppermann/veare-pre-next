const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')

export default (item, loading = 'lazy') => {
  return html`
  <figure class="Picture Picture--${item.style} ${item.classes}">
    <picture>
      ${item.sources[0].fields.contentType !== 'image/svg+xml'
      ? html`<source type="image/webp" srcset="${item.sources[0].fields.url}?fm=webp">` : ''}
      <!-- fallback img tag -->
      <img src="${item.sources[0].fields.url}" alt="${item.title}" loading="${loading}"/>
    </picture>
  </figure>
  ${item.description
    ? html`<div class="Annotation">
        ${unsafeHTML(item.description)}
      </div>`
  : ''}
`
}
