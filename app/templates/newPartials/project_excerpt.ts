import picture from '../newPartials/picture'
import slugToUrl from '../../services/slugToUrl'
const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')

export default (project) => html`
<section class="Project-excerpt Project-card Project-card__link" projectSlug="${project.slug}">
  <!-- Info -->
  <div class="Project-excerpt__info">
    <!-- PICTURE -->
    ${picture(project.previewImage.fields,
      {
        loading: 'lazy',
        sourcesFunction: (picture) => [
        {
          fileType: 'image/webp',
          srcset: [500, 1000, 1400, 2000].map(size => `${picture.image.fields.url}?fm=webp&w=${size} ${size}w`).join(', '),
          sizes: '(min-width: 1200px) 1000px, (min-width: 577px) 700px, 500px'
        }
        ]
      }
    )}
    <!-- TITLE -->
    <div class="Project-excerpt__title">
      <h4 class="Project-card__client">${project.client}</h4>
      <h2 class="Project-card__title">${project.title}</h2>
    </div>
    <!-- Responsibilities -->
    <div class="Project-excerpt__responsibilities">
      <h6>Responsibilities</h6>
      <ul>
        ${repeat(project.responsibilities.slice(0, Math.ceil(project.responsibilities.length / 2)), item => html`<li>${item}</li>`)}
      </ul>
      <ul>
        ${repeat(project.responsibilities.slice(Math.ceil(project.responsibilities.length / 2)), item => html`<li>${item}</li>`)}
      </ul>
    </div>
  </div>
  <!-- END: Info -->
  <!-- Details -->
  <div class="Project-excerpt__details">
    <!-- Challenge & solution -->
    <div class="Project-excerpt__approach">
      ${unsafeHTML(project.approach)}
    </div>
  </div>
  <aside class="Project-excerpt__data">
    <!-- Year & Duration -->
    <dl class="Project-excerpt__time">
      <dt><h6>Year</h6></dt>
      <dd>
        <time datetime="${project.years.start}">${project.years.start}</time>${
          (project.years.start !== project.years.end) ? html` – <time datetime="${project.years.end}">${project.years.end}</time>` : ''}
      </dd>
      <dt><h6>Duration</h6></dt>
      <dd><time datetime="${project.duration.totalWeeks * 4}W">
        ${(project.duration.years > 0) ? html`${project.duration.years} yrs` : ''}
        ${(project.duration.month > 0) ? html`${project.duration.month} mos` : ''}
      </time></dd>
    </dl>
    <!-- END: Details -->
    ${project.slug !== null
      ? html`<a href="${slugToUrl(project.slug, 'project')}" class="Project-excerpt__case_link">View Case</a>`
      : html`<a href="mailto:lukas@vea.re?subject=Hey 👋,%20what&apos;s%20up?&body=Great%20to%20hear%20from%20you,%20how%20can%20I%20help?" class="Project-excerpt__case_link">Get in touch</a>`
    }
  </aside>
</section>
`
