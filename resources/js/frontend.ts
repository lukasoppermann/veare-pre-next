/* global fetch */
let app = window.app
const homepage = fetch('/home?partial=true').then(response => response.text())
const menu = fetch('/fragment/menu').then(response => response.text())
// Promise.all([revisionedFiles, fetchInjectLoaded]).then(json => json[0]).then((json) => {
const litHtml = app.fetchInject([
  `${app.baseUrl}/${app.files.js['js/litHtml.js']}`
])
const layout = app.fetchInject([
  `${app.baseUrl}/${app.files.css['css/app.css']}`,
  `${app.baseUrl}/${app.files.js['js/layoutComponents.js']}`
]).then(() => {
  if (!window.webComponentsSupported()) {
    return app.fetchInject([
      // polyfill
      `${app.baseUrl}/js/webcomponents-sd-ce.js`,
      'https://polyfill.io/v2/polyfill.min.js?features=IntersectionObserver'
    ])
  }
})

const responsiveMenu = app.fetchInject([
  `${app.baseUrl}/${app.files.js['js/responsiveMenu.js']}`
])

Promise.all([homepage, litHtml, layout]).then(([homepageHtml, lit, layout]) => {
  const content = (content) => app.html`<page-sections>${app.unsafeHTML(content)}</page-sections>`
  //
  window.app.render(content(homepageHtml), document.querySelector('main'))
})

Promise.all([menu, litHtml, responsiveMenu, homepage, layout]).then(([menuHtml, litHtml, responsiveMenu, homepage, layout]) => {
  const content = (content) => window.app.html`${app.unsafeHTML(content)}`
  //
  window.app.render(content(menuHtml), document.querySelector('menu'))
  document.querySelector('menu').classList.add('loaded')
})

window.app.fetchInject([
  `https://fonts.googleapis.com/css?family=Montserrat:700|Noto+Serif:400,400i|Source+Sans+Pro:400,600`
]).then(() => {
  document.body.classList.add('fontsLoaded')
})
