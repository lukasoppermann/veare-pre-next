import layout from '../layout'
import headerIntro from '../newPartials/header_intro'
import { templateInterface } from '../../../types/template'

const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')

export default (page, req): templateInterface => {
  return layout(html`
    <div class="Page Page__index" slug="${req.path}">
      ${headerIntro}
      ${unsafeHTML(page.content)}
    </div>
`, {
    og: [
      {
        property: 'og:type',
        value: 'website'
      }, {
        property: 'og:title',
        value: 'Lukas Oppermann — Lead UI/UX Design & Creative Direction — vea.re'
      }, {
        property: 'og:description',
        value: 'Lukas Oppermann is a design lead & creative director from berlin, germany. He loves creating experiences with a focus on usability.'
      }, {
        property: 'og:url',
        value: 'https://vea.re'
      }, {
        property: 'og:image',
        value: 'https://vea.re/media/veare-open-graph.jpg'
      }, {
        property: 'og:image:type',
        value: 'image/jpeg'
      }, {
        property: 'og:image:alt',
        value: 'Lukas Oppermann — Lead UI/UX Design & Creative Direction — vea.re'
      }
    ]
  }, req)
}
