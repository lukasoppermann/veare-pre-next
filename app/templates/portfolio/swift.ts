import { revFile } from '../../services/files'
const { html } = require('@popeindustries/lit-html-server')

export default html`
<div class="Grid portfolio-item--old">
  <section class="stage type-full" style="background-color: rgb(246,245,243)">
    <img class="full-width image" src="/${revFile('media/swift-stage.jpg')}" alt="swift / we are fast" />
  </section>
  <section>
    <a class="portfolio-link-back" href="/home#portfolio">← Back</a>
    <h3 class="o-headline--h2 o-headline--portfolio">swift / we are fast</h3>
  </section>
  <section class="c-section-portfolio-intro">
    <div class="o-project-info">
      <div class="o-project-info__item">
        <h4 class="o-project-info__title">Industry</h4>
        <div class="o-project-info__description">Travel</div>
      </div>
      <div class="o-project-info__item">
        <h4 class="o-project-info__title">Created</h4>
        <div class="o-project-info__description">2011</div>
      </div>
      <div class="o-project-info__item">
        <h4 class="o-project-info__title">Objective</h4>
        <p>Branding for a modern airline which differentiates itself by speed instead of entering the endless pricing battle.</p>
      </div>
    </div>
  </section>
  <section centered class="o-project-section-container">
  <section centered class="o-project-section-container">
    <div class="Grid">
      <h3 class="o-headline--h2 o-headline--portfolio Grid--columns">Swift Logo Design</h3>
      <div class="Grid--columns">
        <img src="/${revFile('media/swift-logo.jpg')}" alt="Swift logo design" />
      </div>
      <div class="old-project-grid-image-main">
        <img src="/${revFile('media/swift-logo-construction.jpg')}" alt="Swift logo constrcution" class="u-full-width" />
      </div>
      <div class="old-project-grid-image-side">
        <img src="/${revFile('media/swift-logo-lockup.jpg')}" alt="Swift logo lockup" class="u-full-width" />
      </div>
      <div class="old-project-grid-text">
        <p>It took about 100 different variations of 6 names to find the one that was just right, a reduced Logotype that is bend to the right to give a feeling of movement and a rough resemblence of the shape of an airplane.</p>
        <p>The logo did not only have to be trustworthy, but needed to fit with the target audience of mainly traveling business people.</p>
      </div>
      <div class="old-project-grid-image-centered">
        <img src="/${revFile('media/swift-logo-sketches.jpg')}" alt="Swift logo Ideas" class="u-full-width" />
      </div>
      <h3 class="o-headline--h2 o-headline--portfolio Grid--columns">Corporate Colors & Patterns</h3>
      <div class="old-project-grid-text">
        <p>The swift corporate identity focusing on the corporate values comfort, trust and speed. The primary color yellow visualises speed and is mainly used in communication and marketing, while the dark green stands for comfort and calmness and is mainly used inside the airplanes & lounge areas.</p>
      </div>
      <div class="Grid--columns">
        <img src="/${revFile('media/swift-colors.jpg')}" alt="Corporate Colors" class="u-full-width" />
      </div>
      <div class="old-project-grid-image-side-start">
        <img src="/${revFile('media/swift-pattern_01.jpg')}" alt="Corporate Patterns" class="u-full-width" />
      </div>
      <div class="old-project-grid-image-side">
        <img src="/${revFile('media/swift-pattern_02.jpg')}" alt="Corporate Patterns" class="u-full-width" />
      </div>
      <h3 class="o-headline--h2 o-headline--portfolio Grid--columns">Stationeries</h3>
      <div class="Grid--columns">
        <img src="/${revFile('media/swift-stationeries.jpg')}" alt="Stationeries in Corporate Design" class="u-full-width" />
      </div>

      <h3 class="o-headline--h2 o-headline--portfolio Grid--columns">Architecture & Vehicles</h3>
      <div class="old-project-grid-image-main">
        <img src="/${revFile('media/swift-car.jpg')}" alt="vehicle with corporate colors & elements" class="u-full-width" />
      </div>
      <div class="old-project-grid-image-side">
        <img src="/${revFile('media/swift-flags.jpg')}" alt="Swift flag design" class="u-full-width" />
      </div>
      <div class="old-project-grid-image-side-start">
        <img src="/${revFile('media/swift-checkin.jpg')}" alt="swift help desk" class="u-full-width" />
      </div>
      <div class="old-project-grid-image-main-right">
        <img src="/${revFile('media/swift-lounge.jpg')}" alt="swift passanger lounge" class="u-full-width" />
      </div>
    </div>
  </section>
</div>
`
