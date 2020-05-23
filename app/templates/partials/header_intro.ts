import { embedFile, revFile } from '../../services/files'
const { html } = require('@popeindustries/lit-html-server')

export default html`
<header class="Header--intro Grid Grid--rows">
  <figure class="Logo">
    ${embedFile('./resources/svgs/veare-logo.svg')}
  </figure>
  <figure class="Header--intro__headline">
    ${embedFile('./resources/svgs/interaction-is-everything.svg')}
  </figure>
  <h2 class="Header--intro__slogan">Designing experiences with a focus on usability</h2>
  <div class="Header--intro__services">
    <div class="Header--intro__services__description">
      <h2 class="Header--intro__services__veare">veare</h2>
      <span>supports clients with</span>
    </div>
    <h1 class="Header--intro__roles">
      Design Lead UI / UX &<br />
      Creative Direction
    </h1>
  </div>
  <figure class="Header__Picture--Lukas-Oppermann">
    <picture>
      <img src="/${revFile('media/lukas-oppermann@2x.png')}" alt="Lukas Oppermann" loading="lazy"/>
    </picture>
  </figure>
  <div class="Header__background"></div>
</header>
`
