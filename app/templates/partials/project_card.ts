const { html } = require('@popeindustries/lit-html-server')

export default (project) => html`
<a class="Project-card Project-card__link" href="${project.slug}" style="background-color: ${project.variables.bgcolor ? project.variables.bgcolor : 'none'};">
  <div class="Project-card__text">
    <h4 class="Project-card__client">${project.variables.client}</h4>
    <h2 class="Project-card__title">${project.subtitle}</h2>
  </div>
  <div class="Project-card__image-container">
    <lazy-picture class="Project-card__image" src="${project.previewImage.fields.url}" alt="${project.previewImage.fields.title}"></lazy-picture>
  </div>
</a>
`
