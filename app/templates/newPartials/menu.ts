const { html } = require('@popeindustries/lit-html-server')

const menuItems = activePath => html`
  <a href="/" class="Menu__link${activePath === '/home' ? ' is-active' : ''}"><span class="Menu__link-text">Index</span></a>
  <a href="https://drive.google.com/open?id=10K9F9o0hokq4iPAbF5mseKJn_yflt19k"  target="_blank" class="Menu__link"><span class="Menu__link-text">Resume</span></a>
  <a href="/blog/" class="Menu__link${activePath === '/blog' ? ' is-active' : ''}"><span class="Menu__link-text">Writing</span></a>
  <a class="Menu__link" target="_blank" href="mailto:lukas@vea.re?subject=Hey 👋,%20what&apos;s%20up?&body=Great%20to%20hear%20from%20you,%20how%20can%20I%20help?"><span class="Menu__link-text">Contact</span></a>
`

export default (activePath, hideOnLoad: boolean = false) => html`
  <menu class="Menu GridNew" activePath="${activePath}">
    <nav class="Menu__items" style="${hideOnLoad !== false ? 'opacity: 0;' : ''}">
      ${menuItems(activePath)}
    </nav>
  </menu>
  <menu class="Menu__overlay GridNew">
    <a class="Menu__icon"></a>
    <nav class="Menu__items" style="display: none;">
      ${menuItems(activePath)}
    </nav>
  </menu>
`
