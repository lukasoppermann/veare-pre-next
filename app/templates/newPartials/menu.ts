const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')

export default ($navItems: String) => html`
  <menu class="Menu GridNew">
    <nav class="Menu__items">
      ${unsafeHTML($navItems)}
    </nav>
  </menu>
  <menu class="Menu__overlay GridNew">
    <a class="Menu__icon">
      Menu
    </a>
    <nav class="Menu__items">
      ${unsafeHTML($navItems)}
    </nav>
  </menu>
`
