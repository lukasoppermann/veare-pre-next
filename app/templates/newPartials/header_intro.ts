import cache from '../../services/cacheService'
const { html } = require('@popeindustries/lit-html-server')
const fs = require('fs')

export default html`
<header class="Header--intro Grid-32">

  <div class="Header--intro__info">
    <h5>Design</h5>
    <p>— a toolkit of methods to explore and address user needs & problems.</p>
  </div>
  <div class="Header--intro__info">
    <h5>Technology</h5>
    <p>— the constraints but also the material from which to build an exciting solution.</p>
  </div>
  <div class="Header--intro__info">
    <h5>Product Thinking</h5>
    <p>— my approach of building products based on validated user needs & measured impact.</p>
  </div>
  <figure class="Header--intro__headline">
    ${fs.readFileSync('./resources/svgs/solving-problems-is-my-passion.svg')}
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
      <img src="/${cache().get('files').media['media/lukas-oppermann@2x.png']}" alt="Lukas Oppermann" loading="lazy"/>
    </picture>
  </figure>
  <div class="Header__background"></div>
</header>
`
