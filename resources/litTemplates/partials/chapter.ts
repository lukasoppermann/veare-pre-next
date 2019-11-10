import section from '../partials/section'
const { html } = require('@popeindustries/lit-html-server')
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')

export default (chapter, classes?: String) => html`
  <page-section centered class="Chapter ${classes} ${chapter.classes}" name="${chapter.slug}">
    ${(chapter.titleType !== 'subtitle') ? ''
    : html`<div class="Grid Chapter__title-Grid">
        <div class="Chapter__title-container"><h5 class="Chapter__title">${chapter.title}</h5></div>
      </div>`
    }
    ${repeat(chapter.sections, (sectionData) => section(sectionData))}
  </page-section>
`
