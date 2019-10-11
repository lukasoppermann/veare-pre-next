const { html } = require('@popeindustries/lit-html-server')
const fs = require('fs')

export default html`
<footer class="Footer Grid">
  <div class="Footer__bio">
    <h4>Lukas Oppermann</h4>
    <p>Creative Director &<br />
    Lead UI/UX Designer</p>
  </div>
  <div class="Footer__contact">
    <h4>Contact</h4>
    <p>lukas@vea.re</p>
  </div>
  <div class="Footer__connect">
    <h4>Connect</h4>
    <p>dribbble<br />
    linkedIn<br />
    twitter<br />
    github</p>
  </div>
  <div class="Footer__legal">
    <h4>Legal</h4>
    <p>Imprint<br />
    Privacy policy</p>
  </div>
  <hr />
  ${fs.readFileSync('./resources/svgs/veare-wordmark.svg')}
  <small class="Footer__copyright">Copyright ${new Date().getFullYear()} — Lukas&nbsp;Oppermann</small>
</footer>
`
