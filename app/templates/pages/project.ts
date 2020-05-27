import layout from '../layout'
import picture from '../newPartials/picture'
const { html } = require('@popeindustries/lit-html-server')
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')

export default (project, req) => {
  return layout(html`
  <header class="Header Header--project Grid Grid--rows">
    <h2 class="Project__title">${project.title}</h2>
    ${picture(project.header.fields, 'eager')}
  </header>
  <article class="Grid">
    <section class="Boxed-group">
      <div class="Boxed-item" style="flex-grow: 3">
        <h5>client</h5>
        <p>${project.client}</p>
      </div>
      <div class="Boxed-item" style="flex-grow: 2">
        <h5>year</h5>
        <p>${project.year}</p>
      </div>
      <div class="Boxed-item" style="flex-grow: 4">
        <h5>role</h5>
        ${project.roleAndTeam}
      </div>
    </section>
    <section class="Project__challenge">
      ${unsafeHTML(project.challenge)}
    </section>
    <!-- {{!-- TOC --}} -->
    <ul class="Toc Project__toc" data-toc>
    ${repeat(project.anchors, (anchor) => html`<li class="Toc__chapter"><a class="Toc__chapter__link" href="#${anchor}"><div class="Toc__chapter__title">${anchor.replace(/-/g, ' ')}</div></a></li>`)}
    </ul>
    ${unsafeHTML(project.content)}
    <a class="Project__back_link" href="/home#portfolio">← Back</a>
  </article>
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
        value: project.title + ' — ' + project.subtitle + ' / client: ' + project.client
      },
      {
        property: 'og:url',
        value: 'https://vea.re/work/' + project.slug
      },
      {
        property: 'og:image',
        value: 'https:' + project.previewImage.fields.url + '?fm=jpg'
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
