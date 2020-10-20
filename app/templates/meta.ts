import appConfig from '../config/appConfig'
const { html } = require('@popeindustries/lit-html-server')
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')
export default (title?: string, description?: string, og?: any, twitter?: any) =>
  html`<title>vea.re Lead UI/UX Design ${title || '& Creative Direction'}</title>
  <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
  <meta name="title" content="${title || 'vea.re Lead UI/UX Design & Creative Direction'}">
  <meta name="description" content="${description || 'Lukas Oppermann is a design lead and creative director from berlin, germany. He loves creating experiences with a focus on usability.'}">
  <meta name="copyright" content="${new Date().getUTCFullYear()}" />
  <meta name="robots" content="index,follow" />
  <meta http-equiv="X-UA-Compatible" content="chrome=1" />
  <meta name="apple-mobile-web-app-title" content="veare" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="theme-color" content="${appConfig.primaryColor}" />
  <!-- Open Graph / Facebook -->
  <meta property="og:locale" content="en_US" />
  ${repeat(og || [], (ogProperty) => html`<meta property="${ogProperty.property}" content="${ogProperty.value}" />\n`)}
  <!-- Twitter -->
  ${repeat(twitter || [], (twitterProperty) => html`<meta property="${twitterProperty.property}" content="${twitterProperty.value}" />\n`)}
  <link rel="icon" href="/svgs/favicon-veare.svg">
  <link rel="mask-icon" href="/svgs/safari-mask-icon.svg" color="${appConfig.primaryColor}">
  <link rel="apple-touch-icon" href="/veare-apple-touch-icon-180.png">
  <link rel="manifest" href="/manifest.json" />`
