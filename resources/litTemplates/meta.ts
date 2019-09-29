const { html } = require('@popeindustries/lit-html-server')
const files = require('../../app/services/files')()
export default (title?: string) =>
  html`<title>vea.re UI/UX Design${title || ' & Creative Direction'}</title>
  <meta name="apple-mobile-web-app-title" content="veare" />
  <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
  <meta name="copyright" content="${new Date().getUTCFullYear()}" />
  <meta name="robots" content="index,follow" />
  <meta http-equiv="X-UA-Compatible" content="chrome=1" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1, maximum-scale=1, user-scalable=no" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="theme-color" content="rgb(240, 170, 30)" />
  <link rel="icon" href="/${files.media['media/veare-icon-32.png']}" type="image/png" />
  <link rel="icon" href="/${files.media['media/veare-icon-32.png']}" type="image/png" sizes="32x32" />
  <link rel="icon" href="/${files.media['media/veare-icon-96.png']}" type="image/png" sizes="96x96" />
  <link rel="apple-touch-icon" href="/${files.media['media/veare-icon-120.png']}">
  <link rel="apple-touch-icon" sizes="152x152" href="/${files.media['media/veare-icon-152.png']}">
  <link rel="apple-touch-icon" sizes="167x167" href="/${files.media['media/veare-icon-168.png']}">
  <link rel="apple-touch-icon" sizes="180x180" href="/${files.media['media/veare-icon-180.png']}">
  <link rel="manifest" href="/manifest.json" />`
