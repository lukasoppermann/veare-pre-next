const { html } = require('@popeindustries/lit-html-server')
const cache = require('../../services/cacheService.js')()

export default html`
<div class="Grid portfolio-item--old">
  <section class="stage type-full" style="background-color: rgb(246,245,243)">
    <img class="full-width image" src="/${cache.get('files').media['media/woyzeck-stage.png']}" alt="Woyzeck – a fragment" />
  </section>
  <section>
    <a class="portfolio-link-back" href="/home#portfolio">← Back</a>
    <h3 class="o-headline--h2 o-headline--portfolio">Woyzeck – a fragment</h3>
  </section>
  <section class="c-section-portfolio-intro">
    <div class="o-project-info">
      <div class="o-project-info__item">
        <h4 class="o-project-info__title">Type</h4>
        <div class="o-project-info__description">Personal</div>
      </div>
      <div class="o-project-info__item">
        <h4 class="o-project-info__title">Created</h4>
        <div class="o-project-info__description">2011</div>
      </div>
      <div class="o-project-info__item">
        <h4 class="o-project-info__title">Objective</h4>
        <p class="type--l">The idea of this project was to present this very interesting piece in multiple layers.</p>
      </div>
    </div>
  </section>
  <section class="portfolio-item--old--copy">
      <div class="type--l">
        <p>This series of 6 typographical posters shows the play “Woyzeck - Ein Fragment” by Georg Büchner. The fragmental nature of the play is symbolised by splitting it in 6 parts.</p>
        <p>There are two layers for the reader, the full text which shows the mood of a scene by highlighting the actors and the excerpts. The excerpts (highlighted in yellow) are accompanied by the analyses (pink) of different literature critics.</p>
      </div>
  </section>
</div>
`
