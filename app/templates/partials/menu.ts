const { html } = require('@popeindustries/lit-html-server')

export default html`
<menu class="responsive-menu">
  <svg id="menuIcon" viewBox="0 0 800 500">
    <path d="M270,220 C300,220 520,220 540,220 C740,220 640,540 520,420 C440,340 300,200 300,200" id="top"></path>
    <path d="M270,320 L540,320" id="middle"></path>
    <path d="M270,210 C300,210 520,210 540,210 C740,210 640,530 520,410 C440,330 300,190 300,190" id="bottom" transform="translate(480, 320) scale(1, -1) translate(-480, -318) "></path>
  </svg>
  <div id="info">
    <aside>
      <div class="c-contact-content">
        <h3>Let's create something together</h3>
        <p class="type--l type--grey">Tell me a bit about your project and your company, and I will get back to you as soon as I can.</p>
        <a class="u-margin-top--m u-margin-bottom--h big-blue-button" rel="noopener" target="_blank" href="mailto:lukas@vea.re">Start your project</a>
        <a class="type--m o-link u-margin-bottom--xs" rel="noopener" target="_blank" href="tel:+491631626947">+49 1631626947</a>
        <a class="type--m o-link u-margin-bottom--xs" rel="noopener" target="_blank" href="mailto:lukas@vea.re">lukas@vea.re</a>
        <div class="type--m type--grey u-margin-top--m">Brehmestr. 18, 13187 Berlin</div>
      </div>
    </aside>
  </div>
  <nav class="responsive-menu__items">
    <a class="responsive-menu__item" href="/">Home</a>
    <a class="responsive-menu__item" href="/home#portfolio">Portfolio</a>
    <a class="responsive-menu__item" href="/home#about">About</a>
    <a class="responsive-menu__item" href="/blog/">Blog</a>
    <a class="responsive-menu__item" href="/home#contact">Contact</a>
  </nav>
  <footer>
    <a href="/privacy" class="responsive-menu__footer-item">imprint</a>
    <a href="/privacy" class="responsive-menu__footer-item">privacy policy</a>
  </footer>
  <div id="background"></div>
</menu>
`
// <responsive-menu hidden collapseSize="800">
// <aside slot="info">
// <div class="c-contact-content">
//   <h3>Let's create something together</h3>
//   <p class="type--l type--grey">Tell me a bit about your project and your company, and I will get back to you as soon as I can.</p>
//   <a class="u-margin-top--m u-margin-bottom--h big-blue-button" rel="noopener" target="_blank" href="mailto:lukas@vea.re">Start your project</a>
//   <a class="type--m o-link u-margin-bottom--xs" rel="noopener" target="_blank" href="tel:+491631626947">+49 1631626947</a>
//   <a class="type--m o-link u-margin-bottom--xs" rel="noopener" target="_blank" href="mailto:lukas@vea.re">lukas@vea.re</a>
//   <div class="type--m type--grey u-margin-top--m">Brehmestr. 18, 13187 Berlin</div>
// </div>
// </aside>
// <a slot="items" class="responsive-menu" href="/">Home</a>
// <a slot="items" class="responsive-menu" href="/home#portfolio">Portfolio</a>
// <a slot="items" class="responsive-menu" href="/home#about">About</a>
// <a slot="items" class="responsive-menu" href="/blog/">Blog</a>
// <a slot="items" class="responsive-menu" href="/home#contact">Contact</a>
// <a slot="footer" href="/privacy" class="responsive-menu">imprint</a>
// <a slot="footer" href="/privacy" class="responsive-menu">privacy policy</a>
// </responsive-menu>
