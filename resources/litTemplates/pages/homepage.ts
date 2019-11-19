import layout from '../layout'
import chapter from '../partials/chapter'
import footer from '../partials/footer'
import collection from '../partials/collection'
import headerIntro from '../partials/header_intro'
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')
const { html } = require('@popeindustries/lit-html-server')
const PageModel = require('../../../app/models/Page')()
const page = PageModel.findBySlug('home').fields
const elements = {
  chapter: chapter,
  collection: collection
}

export default (partial) => {
  return layout(html`
    ${partial === 'true' ? '' : headerIntro}
    <main>
      ${repeat(page.chapters, (chapterData) => elements[chapterData.fields.type](chapterData.fields))}
    </main>
    ${partial === 'true' ? footer : ''}
`, {}, partial)
}
