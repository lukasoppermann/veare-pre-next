const { html } = require('@popeindustries/lit-html-server')
const cache = require('../../../app/services/cacheService.js')()

export default html`
  <page-sections>
    <page-section>
      <div class="stage type-full" style="background-color: rgb(246,245,243)">
        <img class="full-width image" src="/${cache.get('files').media['media/open-everything-stage.jpg']}" alt="Open Everything" />
      </div>
    </page-section>
    <page-section centered maxwidth="1000px">
      <a class="portfolio-link-back" href="/home#portfolio">← Back</a>
      <h3 class="o-headline--h2 o-headline--portfolio">Open Everything</h3>
    </page-section>
    <page-section class="c-section-portfolio-intro" centered maxwidth="1000px">
      <div class="o-project-info o-project-section-container">
        <div class="o-project-info__item">
          <h4 class="o-project-info__title">Industry</h4>
          <div class="o-project-info__description">Publishing</div>
        </div>
        <div class="o-project-info__item">
          <h4 class="o-project-info__title">Created</h4>
          <div class="o-project-info__description">2013</div>
        </div>
        <div class="o-project-info__item">
          <h4 class="o-project-info__title">Objective</h4>
          <p class="type--l u-padding-right--m">This magazine for the re:publica conference 2013 combines different articles on the topic “Open Everything”. <br />The idea is to bring digital content into an analog form but keep some digital mechanics like tags, which are used in the table of content to connect the articles. The reader can following the lines from an article to a tag and from there to a connected article, similar to tags on a web page.</p>
        </div>
      </div>
    </page-section>
    <page-section centered maxwidth="1000px" class="o-project-section-container">
      <div class="Grid">
        <div class="old-project-grid-image-main">
          <img src="/${cache.get('files').media['media/open-everything-magazine-print-design-cover.jpg']}" class="u-full-width" />
        </div>
        <div class="old-project-grid-image-side">
          <img src="/${cache.get('files').media['media/open-everything-magazine-print-design-content.jpg']}" class="u-full-width" />
        </div>
      </div>
    </page-section>
  </page-sections>
`
