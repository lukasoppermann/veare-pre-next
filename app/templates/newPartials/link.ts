import picture from '../newPartials/picture'
const { html } = require('@popeindustries/lit-html-server')

export default (link) => html`
  <section class="Homepage-link">
    <a class="Homepage-link__link" href="${link.link}" class="${link.cssClasses || ''};" target="${link.target}" rel="${link.rel}">
      <div class="Project-card__text">
        <h4 class="Project-card__client">${link.subtitle}</h4>
        <h2 class="Project-card__title">${link.title}</h2>
      </div>
      ${picture(link.picture.fields,
        {
          loading: 'lazy',
          sourcesFunction: (picture) => [
            {
              fileType: 'image/webp',
              srcset: [500, 800, 1100, 1400, 1700].map(size => `${picture.image.fields.url}?fm=webp&w=${size} ${size}w`).join(', '),
              sizes: '(min-width: 1500px) 850px, (min-width: 1400px) 800px, (min-width: 1200px) 700px, (min-width: 992px) 550px, 100vw'
            }
          ]
        }
      )}
    </a>
  </section>
  `
