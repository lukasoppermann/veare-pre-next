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
    <p><a target="_blank" href="mailto:lukas@vea.re">lukas@vea.re</a></p>
  </div>
  <div class="Footer__connect">
    <h4>Connect</h4>
    <p>
      <a href="https://dribbble.com/lukasoppermann">Dribbble</a><br />
      <a href="https://www.linkedin.com/in/lukasoppermann/">LinkedIn</a><br />
      <a href="https://twitter.com/lukasoppermann">Twitter</a><br />
      <a href="https://github.com/lukasoppermann">Github</a>
    </p>
  </div>
  <div class="Footer__legal">
    <h4>Legal</h4>
    <p><a href="/imprint">Imprint</a><br />
    <a href="/privacy-policy">Privacy policy</a></p>
  </div>
  <hr />
  ${fs.readFileSync('./resources/svgs/veare-wordmark.svg')}
  <small class="Footer__copyright">Copyright ${new Date().getFullYear()} — Lukas&nbsp;Oppermann</small>
</footer>
`
