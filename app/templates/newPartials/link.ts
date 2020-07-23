const { html } = require('@popeindustries/lit-html-server')

export default (link) => html`
  <section class="Homepage-link">
    <a class="Homepage-link__link" href="${link.link}" class="${link.cssClasses || ''};" target="${link.target}" rel="${link.rel}">
      <div class="Project-card__text">
        <h4 class="Project-card__client">${link.subtitle}</h4>
        <h2 class="Project-card__title">${link.title}</h2>
      </div>
      <figure class="Project-card__image-container">
        <picture class="Project-card__image">
        <source type="image/webp" srcset="${link.picture.fields.image.fields.url}?fm=webp&w=860" media="(min-width: 1200px)">
        <source type="image/webp" srcset="${link.picture.fields.image.fields.url}?fm=webp&w=780" media="(min-width: 992px)">
        <source type="image/webp" srcset="${link.picture.fields.image.fields.url}?fm=webp&w=930" media="(min-width: 768px)">
        <source type="image/webp" srcset="${link.picture.fields.image.fields.url}?fm=webp&w=700" media="(min-width: 577px)">
        <source type="image/webp" srcset="${link.picture.fields.image.fields.url}?fm=webp&w=500" media="(max-width: 576px)">
        <img src="${link.picture.fields.image.fields.url}" alt="${link.picture.fields.title}" loading="lazy"/>
        </picture>
      </figure>
    </a>
  </section>
  `
// PUT BACK TOP
// <source type="image/webp" srcset="${link.picture.fields.image.fields.url}?fm=webp">
// <img src="${link.picture.fields.image.fields.url}" alt="${link.picture.fields.title}" loading="lazy"/>
