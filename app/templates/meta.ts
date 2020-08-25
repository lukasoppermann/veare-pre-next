import { revFile } from '../services/files'
const { html } = require('@popeindustries/lit-html-server')
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')
export default (title?: string, description?: string, og?: any) =>
  html`<title>vea.re Lead UI/UX Design ${title || '& Creative Direction'}</title>
  <meta name="apple-mobile-web-app-title" content="veare" />
  <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
  <meta name="copyright" content="${new Date().getUTCFullYear()}" />
  <meta name="robots" content="index,follow" />
  <meta name="description" content="${description || 'Lukas Oppermann is a design lead and creative director from berlin, germany. He loves creating experiences with a focus on usability.'}">
  <meta http-equiv="X-UA-Compatible" content="chrome=1" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="theme-color" content="rgb(240, 170, 30)" />
  <meta property="og:locale" content="en_US" />
  ${repeat(og || [], (ogProperty) => html`<meta property="${ogProperty.property}" content="${ogProperty.value}" />\n`)}
  <link rel="icon" href="/${revFile('media/veare-icon-32.png')}" type="image/png" />
  <link rel="icon" href="/${revFile('media/veare-icon-32.png')}" type="image/png" sizes="32x32" />
  <link rel="icon" href="/${revFile('media/veare-icon-96.png')}" type="image/png" sizes="96x96" />
  <link rel="apple-touch-icon" href="/${revFile('media/veare-icon-120.png')}">
  <link rel="apple-touch-icon" sizes="152x152" href="/${revFile('media/veare-icon-152.png')}">
  <link rel="apple-touch-icon" sizes="167x167" href="/${revFile('media/veare-icon-168.png')}">
  <link rel="apple-touch-icon" sizes="180x180" href="/${revFile('media/veare-icon-180.png')}">
  <link rel="manifest" href="/manifest.json" />`
