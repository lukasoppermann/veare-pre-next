import cacheService from '../../services/cacheService'
const cache = cacheService()
const { html } = require('@popeindustries/lit-html-server')

export default html`
<div class="Grid portfolio-item--old">
  <section class="stage type-full" style="background-color: rgb(246,245,243)">
    <img class="full-width image" src="/${cache.get('files').media['media/juicecontrol-stage.jpg']}" alt="Juice Control" />
  </section>
  <section>
    <a class="portfolio-link-back" href="/home#portfolio">← Back</a>
    <h3 class="o-headline--h2 o-headline--portfolio">Juice Control</h3>
  </section>
  <section class="c-section-portfolio-intro">
    <div class="o-project-info">
      <div class="o-project-info__item">
        <h4 class="o-project-info__title">Industry</h4>
        <div class="o-project-info__description">Energy</div>
      </div>
      <div class="o-project-info__item">
        <h4 class="o-project-info__title">Created</h4>
        <div class="o-project-info__description">2011</div>
      </div>
      <div class="o-project-info__item">
        <h4 class="o-project-info__title">Objective</h4>
        <p class="type--l">This app provides an extended overview of the energy consumption in a connected home. Devices like the dryer or the heating system can be controlled from within the app. The interface is reduced and features an illustrative style to encourage the user to explore the information.</p>
      </div>
    </div>
  </section>
  <section class="portfolio-item--old--image">
    <img src="/${cache.get('files').media['media/juicecontrol-heating.jpg']}" alt="heating control" class="u-full-width" />
  </section>
</div>
`
