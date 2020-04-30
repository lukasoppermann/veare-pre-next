import cacheService from '../../services/cacheService'
const cache = cacheService()
const { html } = require('@popeindustries/lit-html-server')

export default html`
  <div class="Grid portfolio-item--old">
    <section class="stage type-full" style="background-color: rgb(246,245,243)">
      <img class="full-width image" src="/${cache.get('files').media['media/d2-homescreen-stage.png']}" alt="Diversity Squared" />
    </section>
    <section>
      <a class="portfolio-link-back" href="/home#portfolio">← Back</a>
      <h3 class="o-headline--h2 o-headline--portfolio">Diversity Squared</h3>
    </section>
    <section class="c-section-portfolio-intro">
      <div class="o-project-info">
        <div class="o-project-info__item">
          <h4 class="o-project-info__title">Industry</h4>
          <div class="o-project-info__description">Publishing</div>
        </div>
        <div class="o-project-info__item">
          <h4 class="o-project-info__title">Created</h4>
          <div class="o-project-info__description">2012</div>
        </div>
        <div class="o-project-info__item">
          <h4 class="o-project-info__title">Objective</h4>
          <p class="type--l">Diversity squared is a tablet-magazine for Berlin. Four issues are produced per year focusing on one of the topics culture, food, people and discovering Berlin. The editorial content is enriched by user generated content and comments. This project has been developed in a cooperation with the publishing company Axel Springer.</p>
        </div>
      </div>
    </section>
    <section class="portfolio-item--old--two-images">
      <img src="/${cache.get('files').media['media/d2-mobile-ipad-magazine-article-cover.jpg']}" alt="mobile magazine app article" />
      <img src="/${cache.get('files').media['media/d2-mobile-ipad-magazine-article.jpg']}" alt="mobile magazine article view" />
    </section>
  </div>
`
