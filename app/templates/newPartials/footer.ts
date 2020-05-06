const { html } = require('@popeindustries/lit-html-server')
const fs = require('fs')

export default html`
<footer class="FooterNew Grid">
  <hr />
  <a class="veare-wordmark" href="/home" name="footer-home-link">${fs.readFileSync('./resources/svgs/veare-wordmark.svg')}</a>
  <div class="Footer__legal">
    <a href="/privacy">Imprint</a>
    <a href="/privacy">Privacy policy</a>
    <small class="Footer__copyright">Copyright ${new Date().getFullYear()} — Lukas&nbsp;Oppermann</small>
  </div>
</footer>
`
