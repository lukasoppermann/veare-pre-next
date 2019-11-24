const { html } = require('@popeindustries/lit-html-server')
const cache = require('../../services/cacheService.js')()

export default html`
<div class="Grid portfolio-item--old">
  <section class="stage type-full" style="background-color: rgb(226,225,223)">
    <img class="centered image" src="/${cache.get('files').media['media/donnerwetter-stage.png']}" alt="Donnerwetter" />
  </section>
  <section>
    <a class="portfolio-link-back" href="/home#portfolio">← Back</a>
    <h3 class="o-headline--h2 o-headline--portfolio">Donnerwetter</h3>
  </section>
  <section class="c-section-portfolio-intro">
    <div class="o-project-info">
      <div class="o-project-info__item">
        <h4 class="o-project-info__title">Type</h4>
        <div class="o-project-info__description">Personal</div>
      </div>
      <div class="o-project-info__item">
        <h4 class="o-project-info__title">Created</h4>
        <div class="o-project-info__description">2010</div>
      </div>
      <div class="o-project-info__item">
        <h4 class="o-project-info__title">Objective</h4>
        <p class="type--l">This calendar consists of 12 posters, one per month. Every poster visualises a different kind of weather information in an information graphic. The dates rotate like the arm of a clock visualizing the time of the year.</p>
      </div>
    </div>
  </section>
</div>
`
