const { html } = require('@popeindustries/lit-html-server')

export default (project) => html`
${console.debug(project, project.previewImage.fields)}
<a class="Project-card Project-card__link" href="${project.slug}" style="background-color: ${project.variables.bgcolor ? project.variables.bgcolor : 'none'};">
  <div class="Project-card__text">
    <h4 class="Project-card__client">${project.title}</h4>
    <h2 class="Project-card__title">${project.subtitle}</h2>
  </div>
  <figure class="Project-card__image-container">
    <picture class="Project-card__image">
      <source type="image/webp" srcset="${project.previewImage.fields.url}?fm=webp">
      <img src="${project.previewImage.fields.url}" alt="${project.previewImage.fields.title}" loading="lazy"/>
    </picture>
  </figure>
</a>
`
