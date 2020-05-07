const { html } = require('@popeindustries/lit-html-server')
const fs = require('fs')

export default html`
<footer class="FooterNew">
  <section class="Footer__read-and-write GridNew">
    <h6 class="Footer__read__headline">Writing</h6>
    <ol class="Footer__read__articles">
      <li>
        <h3>Gestalt Principles: Proximity</h3>
        <div class="details">
          <meta itemprop="author" content="Lukas Oppermann" />
          <meta itemprop="publisher" content="vea.re" />
          <time itemprop="datePublished" class="date" datetime="">Jan 02, 2018</time>
          <time class="read-time" datetime="13m">13 min read</time>
        </div>
      </li>
      <li>
        <h3>Make NPM your build tool</h3>
        <div class="details">
          <meta itemprop="author" content="Lukas Oppermann" />
          <meta itemprop="publisher" content="vea.re" />
          <time itemprop="datePublished" class="date" datetime="">Jan 02, 2018</time>
          <time class="read-time" datetime="13m">13 min read</time>
        </div>
      </li>
      <li>
        <h3>Framer X — a review</h3>
        <div class="details">
          <meta itemprop="author" content="Lukas Oppermann" />
          <meta itemprop="publisher" content="vea.re" />
          <time itemprop="datePublished" class="date" datetime="">Jan 02, 2018</time>
          <time class="read-time" datetime="13m">13 min read</time>
        </div>
      </li>
      <li>
        <h3>Organising Design Documents</h3>
        <div class="details">
          <meta itemprop="author" content="Lukas Oppermann" />
          <meta itemprop="publisher" content="vea.re" />
          <time itemprop="datePublished" class="date" datetime="">Jan 02, 2018</time>
          <time class="read-time" datetime="13m">13 min read</time>
        </div>
      </li>
      <li>
        <a href="/blog/">See all</a>
      </li>
    </ol>
    <div class="Footer__contact">
      <h6 class="Footer__contact__headline">Get in touch</h6>
      <h2 class="Footer__contact__lukas">Lukas Oppermann</h2>
      <h3 class="Footer__contact__job-title">Creative Director &<br /> Lead UI/UX Designer</h3>

      <h6 class="Footer__contact__say-hi">Schedule a call or just say hi <span class="smilie">👋</span></h6>
      <a target="_blank" href="mailto:lukas@vea.re?subject=Hey,%20what&apos;s%20up?&body=Great%20to%20hear%20from%20you,%20how%20can%20I%20help?">lukas@vea.re</a>

      <p>Download my full <a target="_blank" href="mailto:lukas@vea.re?subject=Hey,%20what&apos;s%20up?&body=Great%20to%20hear%20from%20you,%20how%20can%20I%20help?">CV (pdf)</a></p>
    </div>
  </section>
  <section class="Footer__connect GridNew">
    <hr />
    <div class="Footer__connect__block">
      <h6>Business</h6>
      <p>For networking connect on <a href="">LinkedIn</a></p>
    </div>
    <div class="Footer__connect__block">
      <h6>Design</h6>
      <p>Find my latest work on <a href="">Dribbble</a> and <a href="">Behance</a></p>
    </div>
    <div class="Footer__connect__block">
      <h6>Thoughts</h6>
      <p>Explore my thoughts on <a href="">Twitter</a></p>
    </div>
    <div class="Footer__connect__block">
      <h6>Code</h6>
      <p>$ git checkout my code projects on <a href="">Github</a></p>
    </div>
  </section>
  <section class="Footer__legal GridNew">
    <hr />
    <a class="veare-wordmark" href="/home" name="footer-home-link">${fs.readFileSync('./resources/svgs/veare-wordmark.svg')}</a>
    <div class="Footer__legal__info">
      <a href="/privacy">Imprint & privacy policy</a>
      <span class="Footer__separator">•</span>
      <small class="Footer__copyright">Copyright ${new Date().getFullYear()} — Lukas&nbsp;Oppermann</small>
    </div>
  </section>
</footer>
`
