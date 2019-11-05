import layout from '../layout'
import chapter from '../partials/chapter'
const { html } = require('@popeindustries/lit-html-server')
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')

export default (page) => layout(html`
  <page-sections>
    ${repeat(page.chapters, (chapterData) => chapter(chapterData.fields))}
  </page-sections>
`, {
  bodyClass: page.slug
})
