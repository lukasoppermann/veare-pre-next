import { embedFile } from '../../services/files'
const { html } = require('@popeindustries/lit-html-server')

export default html`
<header class="Header--intro">
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
    ${embedFile('./public/svgs/solving-problems-is-my-passion.svg')}
  </figure>
  <h2 class="Header--intro__slogan">Designing experiences with a focus on usability</h2>
  <h1 class="Header--intro__roles">
    Design Lead UI / UX &<br />
    Creative Direction
  </h1>
  <div class="Header__background"></div>
</header>
`
