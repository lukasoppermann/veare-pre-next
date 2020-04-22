const { html } = require('@popeindustries/lit-html-server')

export default (link) => html`
<a class="Project-card Project-card__link" href="${link.link}" class="${link.cssClasses || ''};" target="${link.target}">
  <div class="Project-card__text">
    <h4 class="Project-card__client">${link.subtitle}</h4>
    <h2 class="Project-card__title">${link.title}</h2>
  </div>
  <figure class="Project-card__image-container">
    <picture class="Project-card__image">
    <!-- PUT HERE -->
    </picture>
  </figure>
</a>
`
// PUT BACK TOP
// <source type="image/webp" srcset="${link.picture.fields.image.fields.url}?fm=webp">
// <img src="${link.picture.fields.image.fields.url}" alt="${link.picture.fields.title}" loading="lazy"/>
