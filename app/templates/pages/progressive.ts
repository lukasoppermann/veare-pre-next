import { revisionedFiles, revFile, embedFile } from '../../services/files'
import meta from '../meta'
import headerIntro from '../newPartials/header_intro'
import menu from '../newPartials/menu'
const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')
const path = require('path')

export default () => html`
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="preconnect" href="http://images.ctfassets.net" crossorigin>
  <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
  ${meta('& Creative Direction – Lukas Oppermann', undefined, [
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
  ])}
  <style>
    ${unsafeHTML(embedFile(path.resolve(__dirname, '../../../public/' + revFile('css/slim.css'))))}
  </style>
  <script>
    ${unsafeHTML(embedFile(path.resolve(__dirname, '../../../public/' + revFile('js/appNamespace.js'))))}
    app.files = {
      js: ${unsafeHTML(JSON.stringify(revisionedFiles().js))},
      css: ${unsafeHTML(JSON.stringify(revisionedFiles().css))}
    }
    ${unsafeHTML(embedFile(path.resolve(__dirname, '../../../public/' + revFile('js/frontend.js'))))}
  </script>
  </head>
  <body>
    ${menu('/home', true)}
    <div class="Page Page__index" slug="/home">
      ${headerIntro}
    </div>
  </body>
  </html>
`
