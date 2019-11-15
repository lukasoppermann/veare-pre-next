import layout from '../layout'
import chapter from '../partials/chapter'
import pictureElement from '../partials/pictureElement'
const { html } = require('@popeindustries/lit-html-server')
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')

export default (project) => {
  return layout(html`
  <style media="screen">
    :root{
      --project-color: ${project.variables.color};
    }
  </style>
  <page-sections>
    <page-section>
      <header class="Header Header--project Grid Grid--rows">
        <h2 class="Header__title">${project.title}</h2>
        ${pictureElement(project.header.fields)}
      </header>
    </page-section>
    ${repeat(project.chapters, (chapterData) => chapter(chapterData.fields, 'Chapter--side-title'))}
    <page-section>
      <div class="Grid">
        <a class="Project__back_link" href="/home#portfolio">← Back</a>
      </div>
    </page-section>
  </page-sections>
`, {
    title: project.title,
    bodyClass: 'Page--work Project',
    htmlClass: 'Temp-Override'
  })
}
