const { html } = require('@popeindustries/lit-html-server')
const cache = require('../../../app/services/cacheService.js')()
const fs = require('fs')

export default html`
<header class="Header--intro Grid Grid--rows">
  <figure class="Logo">
    ${fs.readFileSync('./resources/svgs/veare-logo.svg')}
  </figure>
  <figure class="Header--intro__headline">
    ${fs.readFileSync('./resources/svgs/interaction-is-everything.svg')}
  </figure>
  <h2 class="Header--intro__slogan">Designing experiences with a focus on usability.</h2>
  <div class="Header--intro__services">
    <div class="Header--intro__services__description">
      <h2 class="Header--intro__services__veare">veare</h2>
      <span>supports clients with</span>
    </div>
    <h1 class="Header--intro__roles">
      Creative Direction<br />
      UI / UX Concept & Design
    </h1>
  </div>
  <figure class="Header__Picture--Lukas-Oppermann">
    <lazy-picture
      src="/${cache.get('files').media['media/lukas-oppermann@2x.png']}"
      alt="Lukas Oppermann"
    ></lazy-picture>
  </figure>
  <div class="Header__background"></div>
</header>
`
// ${inline_svg 'resources/svgs/veare-logo.svg' preserveAspectRatio="xMinYMin meet"}}}
// {{{inline_svg 'resources/svgs/interaction-is-everything.svg' preserveAspectRatio="xMinYMin meet"}}}
