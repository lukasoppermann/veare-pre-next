const { html } = require('@popeindustries/lit-html-server')
const fs = require('fs')

export default html`
<footer class="Footer Grid">
  <div class="Footer__bio">
    <h4>Lukas Oppermann</h4>
    Creative Director &<br />
    Lead UI/UX Designer
  </div>
  <div class="Footer__contact">
    <h4>Contact</h4>
    lukas@vea.re<br />
  </div>
  <div class="Footer__connect">
    <h4>Connect</h4>
    dribbble<br />
    linkedIn<br />
    twitter<br />
    github
  </div>
  <div class="Footer__legal">
    <h4>Legal</h4>
    Imprint<br />
    Privacy policy
  </div>
  <hr />
  ${fs.readFileSync('./resources/svgs/veare-wordmark.svg')}
  <small class="Footer__copyright">Copyright ${new Date().getFullYear()} — Lukas Oppermann</small>
</footer>
`
