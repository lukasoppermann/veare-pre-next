const { html } = require('@popeindustries/lit-html-server')

export default html`
  <menu class="Menu">
    <a class="Menu__icon">
      Menu
    </a>
    <nav class="responsive-menu__items">
      <a class="responsive-menu__item" href="/">Index</a>
      <a class="responsive-menu__item" href="/home#about">Resume</a>
      <a class="responsive-menu__item" href="/blog/">Writing</a>
      <a class="responsive-menu__item" target="_blank" href="mailto:lukas@vea.re?subject=Hey 👋,%20what&apos;s%20up?&body=Great%20to%20hear%20from%20you,%20how%20can%20I%20help?">Contact</a>
    </nav>
  </menu>
`
