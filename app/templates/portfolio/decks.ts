import { revFile } from '../../services/files'
const { html } = require('@popeindustries/lit-html-server')

export default html`
<div class="Grid portfolio-item--old">
  <section class="stage type-full" style="background-color: rgb(246,245,243)">
    <img class="full-width image" src="/${revFile('media/decks-stage.jpg')}" alt="Decks" />
  </section>
  <section>
    <a class="portfolio-link-back" href="/home#portfolio">← Back</a>
    <h3 class="o-headline--h2 o-headline--portfolio">Decks</h3>
  </section>
  <section class="c-section-portfolio-intro">
    <div class="o-project-info">
      <div class="o-project-info__item">
        <h4 class="o-project-info__title">Type</h4>
        <div>Thesis</div>
      </div>
      <div class="o-project-info__item">
        <h4 class="o-project-info__title">Created</h4>
        <div>2013</div>
      </div>
      <div class="o-project-info__item">
        <h4 class="o-project-info__title">Objective</h4>
        <p>Decks answers the question how our everyday operating systems can be combined with touch operated devices like tablets or the soon to come touch enabled notebooks and desktop computers. The functionality and usability must not be compromised. In this case study I developed an extensive concept and ideas for a possible interface.</p>
      </div>
    </div>
  </section>
  <section class="portfolio-item--old--image">
    <img class="u-full-width" src="/${revFile('media/decks-mobile-file-interface.jpg')}" alt="interface concept for file system on mobile and desktop.">
    <div class="portfolio-item--old--image__description">
      <p>Tag search and file attributes on the mobile version of decks.</p>
    </div>
  </section>
</div>
`
