const { html } = require('@popeindustries/lit-html-server')
const fs = require('fs')

export default html`
  <footer>
  Lukas Oppermann

  Copyright ${new Date().getFullYear()} by veare
  ${fs.readFileSync('./resources/svgs/veare-wordmark.svg')}
  </footer>
`
