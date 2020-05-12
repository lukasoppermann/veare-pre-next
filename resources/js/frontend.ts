/* global fetch */
const app = window.app
const homepage = fetch('/home?partial=true').then(response => response.text())
const menu = fetch('/fragment/menu').then(response => response.text())

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
})

Promise.all([menu, litHtml, homepage, layout]).then(([menuHtml]) => {
  const content = (content) => app.html`${app.unsafeHTML(content)}`
  //
  app.render(content(menuHtml), document.querySelector('.responsive-menu'))
  document.querySelector('.responsive-menu').classList.add('loaded')
}).then(() => {
  app.fetchInject([
    `${app.baseUrl}/${app.files.js['js/responsiveMenu.js']}`
  ])
})

window.app.fetchInject([
  'https://fonts.googleapis.com/css?family=Montserrat:700|Noto+Serif:400,400i|Source+Sans+Pro:400,600|Source+Code+Pro:400'
]).then(() => {
  document.body.classList.add('fontsLoaded')
})
