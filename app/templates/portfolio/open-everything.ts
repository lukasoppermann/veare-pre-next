import cacheService from '../../services/cacheService'
const cache = cacheService()
const { html } = require('@popeindustries/lit-html-server')

export default html`
<div class="Grid portfolio-item--old">
  <section class="stage type-full" style="background-color: rgb(246,245,243)">
    <img class="full-width image" src="/${cache.get('files').media['media/open-everything-stage.jpg']}" alt="Open Everything" />
  </section>
  <section>
    <a class="portfolio-link-back" href="/home#portfolio">← Back</a>
    <h3 class="o-headline--h2 o-headline--portfolio">Open Everything</h3>
  </section>
  <section class="c-section-portfolio-intro">
    <div class="o-project-info">
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
        <p>This magazine for the re:publica conference 2013 combines different articles on the topic “Open Everything”. <br />The idea is to bring digital content into an analog form but keep some digital mechanics like tags, which are used in the table of content to connect the articles. The reader can following the lines from an article to a tag and from there to a connected article, similar to tags on a web page.</p>
      </div>
    </div>
  </section>
  <section class="portfolio-item--old--two-images">
    <img src="/${cache.get('files').media['media/open-everything-magazine-print-design-cover.jpg']}" />
    <img src="/${cache.get('files').media['media/open-everything-magazine-print-design-content.jpg']}" />
  </section>
</div>
`
