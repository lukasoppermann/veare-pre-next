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
  <header class="Header Header--project Grid Grid--rows">
    <h2 class="Header__title">${project.title}</h2>
    ${pictureElement(project.header.fields, 'eager')}
  </header>
${repeat(project.chapters, (chapterData) => chapter(chapterData.fields, 'Chapter--side-title'))}
  <div class="Grid">
    <a class="Project__back_link" href="/home#portfolio">← Back</a>
  </div>
`, {
    title: project.title,
    bodyClass: 'Page--work Project',
    htmlClass: 'Temp-Override'
  })
}
