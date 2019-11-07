const { html } = require('@popeindustries/lit-html-server')
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')

export default (item) => html`
  <figure class="Picture__Element Picture__Element--${item.style} ${item.classes}
    <!-- {{ifDefined item.backgroundColor ' Picture__Element--background'}}"
    {{{ifDefined item.backgroundColor (join ' style="--backgroundColor: ' item.backgroundColor '"')}}} -->
  >
    <lazy-picture src="${item.image.fields.url}" alt="${item.title}">
    ${repeat(item.sources, (source) => `<source media="${source.fields.mediaQuery}" srcset="${source.fields.image.fields.url}">`)}
    </lazy-picture>
  </figure>
  <!-- {{#if item.description}}
    <div class="Annotation">
      <div class="Annotation__text">${unsafeHTML(item.description)}</div>
    </div>
  {{/if}} -->
`
