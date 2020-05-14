const { html } = require('@popeindustries/lit-html-server')

const menuItems = activePath => html`
  <a href="/" class="Menu__link${activePath === '/home' ? ' is-active' : ''}">Index</a>
  <a href="https://drive.google.com/open?id=10K9F9o0hokq4iPAbF5mseKJn_yflt19k"  target="_blank" class="Menu__link">Resume</a>
  <a href="/blog/" class="Menu__link${activePath === '/blog' ? ' is-active' : ''}">Writing</a>
  <a class="Menu__link" target="_blank" href="mailto:lukas@vea.re?subject=Hey 👋,%20what&apos;s%20up?&body=Great%20to%20hear%20from%20you,%20how%20can%20I%20help?">Contact</a>
`

export default (activePath, hideOnLoad: boolean = false) => html`
  <menu class="Menu GridNew" activePath="${activePath}">
    <nav class="Menu__items" style="${hideOnLoad !== false ? 'opacity: 0;' : ''}">
      ${menuItems(activePath)}
    </nav>
  </menu>
  <menu class="Menu__overlay GridNew" style="opacity: none;">
    <a class="Menu__icon">
      Menu
    </a>
    <nav class="Menu__items">
      ${menuItems(activePath)}
    </nav>
  </menu>
`
