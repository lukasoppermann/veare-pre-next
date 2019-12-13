import layout from '../layout'
import chapter from '../partials/chapter'
import pictureElement from '../partials/pictureElement'
const { html } = require('@popeindustries/lit-html-server')
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')

export default (project) => {
  return layout(html`
  <style media="screen">
    :root{
      --project-color: ${project.variables.color};
    }
  </style>
  <header class="Header Header--project Grid Grid--rows">
    <h2 class="Header__title">${project.title}</h2>
    ${pictureElement(project.header.fields, 'eager')}
  </header>
  <section class="Chapter">
    <div class="Section Grid">
      <div class="Boxed-group Grid--columns">
        <div class="Boxed-item" style="flex-grow: 3">
          <span class="Headline--h5 text--light">client</span>
          <div class="Paragraph Paragraph--sans-small">
            ${project.client}
          </div>
        </div>
        <div class="Boxed-item" style="flex-grow: 2">
          <span class="Headline--h5 text--light">year</span>
          <div class="Paragraph Paragraph--sans-small">
            ${project.year}
          </div>
        </div>
        <div class="Boxed-item" style="flex-grow: 4">
          <span class="Headline--h5 text--light">role</span>
          <div class="Paragraph Paragraph--sans-small">
            ${project.roleAndTeam}
          </div>
        </div>
      </div>
      <div class="Text__Element Project__challenge">
        ${unsafeHTML(project.challenge)}
      </div>
      <!-- {{!-- TOC --}} -->
      <ul class="Toc Project__toc" data-toc>
      ${repeat(project.chapters, (chapter) => {
        if (chapter.fields.slug !== undefined) {
          return html`<li class="Toc__chapter"><a class="Toc__chapter__link" href="#${chapter.fields.slug}"><div class="Toc__chapter__title">${chapter.fields.title}</div></a></li>`
        }
      })}
      </ul>
    </div>
  </section>
  ${repeat(project.chapters, (chapterData) => chapter(chapterData.fields, 'Chapter--side-title'))}
  <div class="Grid">
    <a class="Project__back_link" href="/home#portfolio">← Back</a>
  </div>
`, {
    title: project.title,
    og: [
      {
        property: 'og:image',
        value: project.previewImage.fields.url + '?fm=jpg'
      }, {
        property: 'og:image:type',
        value: 'image/jpeg'
      }, {
        property: 'og:image:alt',
        value: project.header.fields.title
      }
    ],
    bodyClass: 'Page--work Project',
    htmlClass: 'Temp-Override'
  })
}
