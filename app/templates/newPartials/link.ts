import picture from '../newPartials/picture'
const { html } = require('@popeindustries/lit-html-server')

export default (link) => html`
  <section class="Homepage-link">
    <a class="Homepage-link__link" href="${link.link}" class="${link.cssClasses || ''};" target="${link.target}" rel="${link.rel}">
      <div class="Project-card__text">
        <h4 class="Project-card__client">${link.subtitle}</h4>
        <h2 class="Project-card__title">${link.title}</h2>
      </div>
      ${picture(link.picture.fields, 'lazy', [
        {
          type: 'image/webp',
          srcset: [500, 1000, 1600, 2000].map(size => `${link.picture.fields.image.fields.url}?fm=webp&w=${size} ${size}w`).join(', '),
          sizes: '(min-width: 760px) 930px, 100vw'
        }
      ])}
    </a>
  </section>
  `
