const { html } = require('@popeindustries/lit-html-server')
const fs = require('fs')

export default html`
<footer class="Footer Grid">
  <a name="contact"></a>
  <div class="Footer__bio">
    <h4>Lukas Oppermann</h4>
    <p>Creative Director &<br />
    Lead UI/UX Designer</p>
  </div>
  <div class="Footer__contact">
    <h4>Say hello</h4>
    <p><a target="_blank" href="mailto:lukas@vea.re?subject=Hey,%20what&apos;s%20up?&body=Great%20to%20hear%20from%20you,%20how%20can%20I%20help?">lukas@vea.re</a></p>
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
    <p><a href="/privacy">Imprint</a><br />
    <a href="/privacy">Privacy policy</a></p>
  </div>
  <hr />
  <a class="veare-wordmark" href="/home" name="footer-home-link">${fs.readFileSync('./resources/svgs/veare-wordmark.svg')}</a>
  <small class="Footer__copyright">Copyright ${new Date().getFullYear()} — Lukas&nbsp;Oppermann</small>
</footer>
`
