import layout from '../layout'
import chapter from '../partials/chapter'
import headerIntro from '../partials/header_intro'
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')
const { html } = require('@popeindustries/lit-html-server')

export default (page, partial) => {
  return layout(html`
    ${headerIntro}
    <main>
      ${repeat(page.chapters, (chapterData) => chapter(chapterData.fields))}
    </main>
    <a name="contact"></a>
`, {}, partial)
}
