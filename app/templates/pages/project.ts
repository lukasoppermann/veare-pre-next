import slugToUrl from '../../services/slugToUrl'
import layout from '../layout'
import picture from '../newPartials/picture'
const { html } = require('@popeindustries/lit-html-server')
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')

export default (project, req) => {
  return layout(html`
  <div class="Page Page__Project" slug="${req.path}">
    <header class="Header">
      ${picture(project.header.fields,
        {
          loading: 'eager',
          sourcesFunction: (picture) => [
            {
              fileType: 'image/webp',
              srcset: [400, 800, 1600, 3200].map(size => `${picture.image.fields.url}?fm=webp&w=${size} ${size}w`).join(', '),
              sizes: '(min-width: 1560px) 1540px, 100vw'
            }
          ]
        }
      )}
    </header>
    <article>
      <!-- {{!-- TOC --}} -->
      <section class="Project__intro">
        <ul class="Toc Project__toc">
          ${repeat(project.anchors, (anchor) => html`<li class="Toc__chapter"><a class="Toc__chapter__link" href="#${anchor}"><div class="Toc__chapter__title">${anchor.replace(/-/g, ' ')}</div></a></li>`)}
        </ul>
        <div class="Project__approach">
          <div class="Project__title">
            <h2 class="Project__title--client">${project.client}</h2>
            <h1 class="Project__title--title">${project.title}</h1>
          </div>
          ${unsafeHTML(project.approach)}
        </div>
        <aside class="Project__info">
          <!-- Year & Duration -->
          <dl class="Project__info__time">
            <dt><h6>Year</h6></dt>
            <dd>
              <time datetime="${project.years.start}">${project.years.start}</time>${
                (project.years.start !== project.years.end) ? html` – <time datetime="${project.years.end}">${project.years.end}</time>` : ''}
            </dd>
            <dt><h6>Duration</h6></dt>
            <dd><time datetime="${project.duration.totalWeeks * 4}W">
              ${(project.duration.years > 0) ? html`${project.duration.years}&nbsp;yrs` : ''}
              ${(project.duration.month > 0) ? html`${project.duration.month}&nbsp;mos` : ''}
            </time></dd>
          </dl>
          <!-- Team -->
          <div class="Project__info__team">
            <h6>Team</h6>
            <ul>
              ${repeat(project.team, item => html`<li>${item}</li>`)}
            </ul>
          </div>
          <!-- Responsibilities -->
          <div class="Project__info__responsibilities">
            <h6>Responsibilities</h6>
            <ul>
              ${repeat(project.responsibilities, item => html`<li>${item}</li>`)}
            </ul>
          </div>
          <!-- Platforms -->
          <div class="Project__info__platforms">
            <h6>Platforms</h6>
            <ul>
              ${repeat(project.platforms, item => html`<li>${item}</li>`)}
            </ul>
          </div>
        </aside>
      </section>
      ${unsafeHTML(project.content)}
      <a class="Project__back_link" href="/home#portfolio">← Back</a>
    </article>
  </div> 
`, {
    title: project.title,
    og: [
      {
        property: 'og:type',
        value: 'website'
      },
      {
        property: 'og:title',
        value: 'Lukas Oppermann — Lead UI/UX Design & Creative Direction — Project: ' + project.title
      },
      {
        property: 'og:description',
        value: project.title + ' / client: ' + project.client
      },
      {
        property: 'og:url',
        value: 'https://vea.re' + slugToUrl(project.slug, 'project')
      },
      {
        property: 'og:image',
        value: 'https:' + project.previewImage.fields.image.fields.url + '?fm=jpg'
      }, {
        property: 'og:image:type',
        value: 'image/jpeg'
      }, {
        property: 'og:image:alt',
        value: project.header.fields.title
      }
    ],
    bodyClass: 'Page--work Project'
  }, req)
}
