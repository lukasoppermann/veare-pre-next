const { html } = require('@popeindustries/lit-html-server')
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')

export default (item) => {
  return html`
  <figure class="Picture__Element Picture__Element--${item.style} ${item.classes}">
    <lazy-picture src="${item.image.fields.url}" alt="${item.title}">
      ${repeat(item.sources, (source) => html`<source media="${source.fields.mediaQuery}" srcset="${source.fields.image.fields.url}">`)}
    </lazy-picture>
  </figure>
  ${item.description
    ? html`<div class="Annotation">
        <div class="Annotation__text">${unsafeHTML(item.description)}</div>
      </div>`
  : ''}
`
}
// ${item.backgroundColor !== null ? 'Picture__Element--background" style="--backgroundColor: ' + item.backgroundColor : ''}
