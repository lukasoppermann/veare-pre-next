import layout from '../layout'
import chapter from '../partials/chapter'
import footer from '../partials/footer'
import collection from '../partials/collection'
import headerIntro from '../partials/header_intro'
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')
const { html } = require('@popeindustries/lit-html-server')
const PageModel = require('../../models/Page')()
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
`, {
    og: [
      {
        property: 'og:title',
        value: 'Lukas Oppermann — Lead UI/UX Design & Creative Direction — vea.re'
      }, {
        property: 'og:description',
        value: 'Lukas Oppermann is a design lead & creative director from berlin, germany. He loves creating experiences with a focus on usability.'
      }, {
        property: 'og:url',
        value: '//vea.re'
      }, {
        property: 'og:image',
        value: '/media/veare-open-graph.jpg'
      }, {
        property: 'og:image:type',
        value: 'image/jpeg'
      }, {
        property: 'og:image:alt',
        value: 'Lukas Oppermann — Lead UI/UX Design & Creative Direction — vea.re'
      }
    ]
  }, partial)
}
