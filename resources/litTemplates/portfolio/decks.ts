const { html } = require('@popeindustries/lit-html-server')
const cache = require('../../../app/services/cacheService.js')()

export default html`
  <page-section>
    <div class="stage type-full" style="background-color: rgb(246,245,243)">
      <img class="full-width image" src="/${cache.get('files').media['media/decks-stage.jpg']}" alt="Decks" />
    </div>
  </page-section>
  <page-section centered maxwidth="1000px">
    <a class="portfolio-link-back" href="/home#portfolio">← Back</a>
    <h3 class="o-headline--h2 o-headline--portfolio">Decks</h3>
  </page-section>
  <page-section class="c-section-portfolio-intro" centered maxwidth="1000px">
    <div class="o-project-info o-project-section-container">
      <div class="o-project-info__item">
        <h4 class="o-project-info__title">Type</h4>
        <div class="type--xl">Thesis</div>
      </div>
      <div class="o-project-info__item">
        <h4 class="o-project-info__title">Created</h4>
        <div class="type--xl">2013</div>
      </div>
      <div class="o-project-info__item">
        <h4 class="o-project-info__title">Objective</h4>
        <p class="type--l">Decks answers the question how our everyday operating systems can be combined with touch operated devices like tablets or the soon to come touch enabled notebooks and desktop computers. The functionality and usability must not be compromised. In this case study I developed an extensive concept and ideas for a possible interface.</p>
      </div>
    </div>
  </page-section>
  <page-section centered maxwidth="1000px" class="o-project-section-container">
    <div class="Grid">
      <div class="Grid--full">
        <img class="u-full-width" src="/${cache.get('files').media['media/decks-mobile-file-interface.jpg']}" alt="interface concept for file system on mobile and desktop.">
      </div>
      <div class="old-project-grid-text">
        <p class="type--m">Tag search and file attributes on the mobile version of decks.</p>
      </div>
    </div>
  </page-section>
`
