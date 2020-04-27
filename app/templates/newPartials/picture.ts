const { html } = require('@popeindustries/lit-html-server')
// const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')

export default (item, loading = 'lazy') => {
  return html`
  <figure class="Picture Picture__Element Picture__Element--${item.style} ${item.classes}">
    <picture>
      ${item.sources[0].fields.contentType !== 'image/svg+xml'
      ? html`<source type="image/webp" srcset="${item.sources[0].fields.url}?fm=webp">` : ''}
      <!-- fallback img tag -->
      <img src="${item.sources[0].fields.url}" alt="${item.title}" loading="${loading}"/>
    </picture>
  </figure>
  ${item.description
    ? html`<div class="Annotation">
        <div class="Annotation__text">${unsafeHTML(item.description)}</div>
      </div>`
  : ''}
`
}
// style="--aspect-ratio:${item.image.fields.details.image.width / item.image.fields.details.image.height}; ${item.backgroundColor !== null ? '--backgroundColor: ' + item.backgroundColor + ';' : ''}"
// ${repeat(item.sources, (source) => html`<source media="${source.fields.mediaQuery}" type="image/webp" srcset="${source.fields.image.fields.url}?fm=webp">`)}
