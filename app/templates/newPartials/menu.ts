const { html } = require('@popeindustries/lit-html-server')

export default html`
  <svg id="menuIcon" viewBox="0 0 800 500">
    <path d="M270,220 C300,220 520,220 540,220 C740,220 640,540 520,420 C440,340 300,200 300,200" id="top"></path>
    <path d="M270,320 L540,320" id="middle"></path>
    <path d="M270,210 C300,210 520,210 540,210 C740,210 640,530 520,410 C440,330 300,190 300,190" id="bottom" transform="translate(480, 320) scale(1, -1) translate(-480, -318) "></path>
  </svg>
  <nav class="responsive-menu__items">
    <a class="responsive-menu__item" href="/">Home</a>
    <a class="responsive-menu__item" href="/home#about">About</a>
    <a class="responsive-menu__item" href="/blog/">Blog</a>
    <a class="responsive-menu__item" target="_blank" href="mailto:lukas@vea.re?subject=Hey 👋,%20what&apos;s%20up?&body=Great%20to%20hear%20from%20you,%20how%20can%20I%20help?">Contact</a>
  </nav>
  <div id="background"></div>
`
