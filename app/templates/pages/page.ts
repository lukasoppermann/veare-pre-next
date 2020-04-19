import layout from '../layout'
// import chapter from '../partials/chapter'
const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')
// const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')
// ${repeat(page.chapters, (chapterData) => chapter(chapterData.fields))}
export default (page) => layout(html`
  ${unsafeHTML(page.content)}
`, {
  bodyClass: page.slug
})
