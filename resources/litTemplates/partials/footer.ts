const { html } = require('@popeindustries/lit-html-server')
const fs = require('fs')

export default html`
<footer class="Footer Grid">
  Lukas Oppermann
  <hr />
  ${fs.readFileSync('./resources/svgs/veare-wordmark.svg')}
  <small class="Footer__copyright">Copyright ${new Date().getFullYear()} — Lukas Oppermann</small>
</footer>
`
