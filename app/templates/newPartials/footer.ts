import articlePreview from './article_preview'
import cache from '../../services/cacheService'
import { embedFile } from '../../services/files'
const { html } = require('@popeindustries/lit-html-server')
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')

export default () => {
  // get latest 4 articles
  const articles = cache.get('article').slice(0, 4)
  // return template
  return html`
  <footer class="Footer">
    <section class="Footer__read-and-write">
      <h6 class="Footer__read__headline">Writing</h6>
      <ol class="Footer__read__articles">
        ${repeat(articles, (article) => html`<li itemprop="blogPost" itemscope itemtype="http://schema.org/BlogPosting">${articlePreview(article.fields)}</li>`)}
        <li>
          <a class="link-show-all" href="/blog/">See all →</a>
        </li>
      </ol>
      <div class="Footer__contact">
        <h6 class="Footer__contact__headline">Get in touch</h6>
        <h2 class="Footer__contact__lukas">Lukas Oppermann</h2>
        <h3 class="Footer__contact__job-title">Creative Director &<br /> Lead UI/UX Designer</h3>

        <h6 class="Footer__contact__say-hi">Schedule a call or say&nbsp;hi&nbsp;<span class="smilie">👋</span></h6>
        <a class="Footer__contact__email" target="_blank" rel="noopener" href="mailto:lukas@vea.re?subject=Hey 👋,%20what&apos;s%20up?&body=Great%20to%20hear%20from%20you,%20how%20can%20I%20help?">lukas@vea.re</a>

        <a class="Footer__contact__cv" target="_blank" rel="noopener" href="https://drive.google.com/open?id=10K9F9o0hokq4iPAbF5mseKJn_yflt19k">${embedFile('./public/svgs/file-download.svg')}Download my full CV (pdf)</a>
      </div>
    </section>
    <section class="Footer__connect">
      <hr />
      <div class="Footer__connect__block">
        <h6>Business</h6>
        <p>For networking connect on <a href="https://www.linkedin.com/in/lukasoppermann" rel="noopener" target="_blank">LinkedIn</a></p>
      </div>
      <div class="Footer__connect__block">
        <h6>Design</h6>
        <p>Find my latest work on <a href="https://dribbble.com/lukasoppermann" rel="noopener" target="_blank">Dribbble</a> and <a href="https://www.behance.net/lukasoppermann" rel="noopener" target="_blank">Behance</a></p>
      </div>
      <div class="Footer__connect__block">
        <h6>Thoughts</h6>
        <p>Explore my thoughts on <a href="https://twitter.com/lukasoppermann" rel="noopener" target="_blank">Twitter</a></p>
      </div>
      <div class="Footer__connect__block">
        <h6>Code</h6>
        <p>$ git checkout my code projects on <a href="https://github.com/lukasoppermann" rel="noopener" target="_blank">Github</a></p>
      </div>
    </section>
    <section class="Footer__legal">
      <hr />
      <a class="veare-wordmark" href="/" aria-label="Go to homepage" name="footer home link">${embedFile('./public/svgs/veare-wordmark.svg')}</a>
      <div class="Footer__legal__info">
        <a href="/">Index</a>
        <a href="/about-lukas-oppermann">About</a>
        <a href="/now">Now</a>
        <a href="/blog">Writing</a>
        <a href="/privacy">Imprint & privacy policy</a>
        <small class="Footer__copyright">Copyright ${new Date().getFullYear()} — Lukas&nbsp;Oppermann</small>
      </div>
    </section>
  </footer>
  `
}
