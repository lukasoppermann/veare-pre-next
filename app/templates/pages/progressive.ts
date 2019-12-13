import meta from '../meta'
import headerIntro from '../partials/header_intro'
const cache = require('../../services/cacheService')()
const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')
const fs = require('fs')
const path = require('path')

export default () => html`
<!DOCTYPE html>
<html lang="en">
<head>
  ${meta('& Creative Direction – Lukas Oppermann', [
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
      ])}
  <style>
    ${unsafeHTML(fs.readFileSync(path.resolve(__dirname, '../../../public/' + cache.get('files').css['css/slim.css'])))}
  </style>
  <script>
    ${unsafeHTML(fs.readFileSync(path.resolve(__dirname, '../../../public/' + cache.get('files').js['js/appNamespace.js'])))}
    app.files = {
      js: ${unsafeHTML(JSON.stringify(cache.get('files').js))},
      css: ${unsafeHTML(JSON.stringify(cache.get('files').css))}
    }
    ${unsafeHTML(fs.readFileSync(path.resolve(__dirname, '../../../public/' + cache.get('files').js['js/frontend.js'])))}
  </script>
  </head>
  <body>
    <div class="Page">
      <menu class="responsive-menu"></menu>
        ${headerIntro}
      <main>
      </main>
    </div>
  </body>
  </html>
`
