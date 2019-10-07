const { html } = require('@popeindustries/lit-html-server')

export default html`
  <nav>
    <responsive-menu hidden collapseSize="800">
    <aside slot="info">
    <div class="c-contact-content">
      <h3>Let's create something together</h3>
      <p class="type--l type--grey">Tell me a bit about your project and your company, and I will get back to you as soon as I can.</p>
      <a class="u-margin-top--m u-margin-bottom--h big-blue-button" rel="noopener" target="_blank" href="mailto:lukas@vea.re">Start your project</a>
      <a class="type--m o-link u-margin-bottom--xs" rel="noopener" target="_blank" href="tel:+491631626947">+49 1631626947</a>
      <a class="type--m o-link u-margin-bottom--xs" rel="noopener" target="_blank" href="mailto:lukas@vea.re">lukas@vea.re</a>
      <div class="type--m type--grey u-margin-top--m">Brehmestr. 18, 13187 Berlin</div>
    </div>
    </aside>
    <a slot="items" class="responsive-menu" href="/">Home</a>
    <a slot="items" class="responsive-menu" href="#portfolio">Portfolio</a>
    <a slot="items" class="responsive-menu" href="#about">About</a>
    <a slot="items" class="responsive-menu" href="/blog/">Blog</a>
    <a slot="items" class="responsive-menu" href="#contact">Contact</a>
    <a slot="footer" href="/privacy" class="responsive-menu">imprint</a>
    <a slot="footer" href="/privacy" class="responsive-menu">privacy policy</a>
    </responsive-menu>
  </nav>
`
