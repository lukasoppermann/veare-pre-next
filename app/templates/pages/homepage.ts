import layout from '../layout'
import footer from '../newPartials/footer'
import headerIntro from '../newPartials/header_intro'
import { templateInterface } from '../../../types/template'

const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')

export default (page, req): templateInterface => {
  const url = new URL(req.url, `https://${req.headers.host}`)

  return layout(html`
    ${url.searchParams.get('partial') === 'true' ? '' : headerIntro}
    <main>
      ${unsafeHTML(page.content)}
    </main>
    ${url.searchParams.get('partial') === 'true' ? footer() : ''}
`, {
    pageClass: 'Page__index',
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
  }, url)
}
