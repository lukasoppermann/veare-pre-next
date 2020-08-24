/* global fetch */
const app = window.app
const homepage = fetch('/home?partial=true').then(response => response.text())

const layout = app.fetchInject([
  `${app.baseUrl}/${app.files.css['css/app.css']}`
])

Promise.all([homepage, layout]).then(([homepageHtml]) => {
  const html = document.querySelector('.Page').innerHTML + ' ' + homepageHtml
  //
  document.querySelector('.Page').innerHTML = html
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
