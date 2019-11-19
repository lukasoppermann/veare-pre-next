const { html } = require('@popeindustries/lit-html-server')
const cache = require('../../../app/services/cacheService.js')()

export default html`
  <page-sections>
    <page-section>
      <div class="stage type-full" style="background-color: rgb(245,215,85)">
        <div class="u-center">
          <img class="u-margin-bottom--h u-margin-top--xg" src="/${cache.get('files').media['media/lufthansa_germanwings_infographic.png']}" alt="The new germanwings" />
        </div>
      </div>
    </page-section>
    <page-section centered maxwidth="1000px">
      <a class="portfolio-link-back" href="/home#portfolio">← Back</a>
      <h3 class="o-headline--h2 o-headline--portfolio">The new germanwings</h3>
    </page-section>
    <page-section class="c-section-portfolio-intro" centered maxwidth="1000px">
      <div class="o-project-info o-project-section-container">
        <div class="o-project-info__item o-project-info__item--first">
          <h4 class="o-project-info__title">Industry</h4>
          <div class="o-project-info__description">Travel</div>
        </div>
        <div class="o-project-info__item o-project-info__item--middle">
          <h4 class="o-project-info__title">Created</h4>
          <div class="o-project-info__description">2013</div>
        </div>
        <div class="o-project-info__item o-project-info__item--last">
          <h4 class="o-project-info__title">Objective</h4>
          <p class="type--l">After germanwings was acquired by Lufthansa they underwent some changes in structure and services. This infographic was produced for their facebook page to inform their customers about the most important changes.</p>
        </div>
      </div>
    </page-section>
  </page-sections>
`
