/* global fetch */
const app = window.app
const homepage = fetch('/home?partial=true').then(response => response.text())
// const menu = fetch('/fragment/menu').then(response => response.text())

const litHtml = app.fetchInject([
  `${app.baseUrl}/${app.files.js['js/litHtml.js']}`
])
const layout = app.fetchInject([
  `${app.baseUrl}/${app.files.css['css/app.css']}`
])

Promise.all([homepage, litHtml, layout]).then(([homepageHtml]) => {
  const content = (content) => app.html`${app.unsafeHTML(content)}`
  const html = document.querySelector('.Page').innerHTML + ' ' + homepageHtml
  //
  app.render(content(html), document.querySelector('.Page'))
  document.querySelector('.Menu').classList.add('loaded')
}).then(() => {
  app.fetchInject([
    `${app.baseUrl}/${app.files.js['js/responsiveMenu.js']}`
  ])
})

window.app.fetchInject([
  'https://fonts.googleapis.com/css?family=$googleFonts'
]).then(() => {
  document.body.classList.add('fontsLoaded')
})
