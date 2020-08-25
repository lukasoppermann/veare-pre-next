/* global fetch */
const app = window.app
const homepage = fetch('/home?partial=true').then(response => response.text())

// @ts-ignore
const layout = app.fetchInject([
  // @ts-ignore
  `${app.baseUrl}/${app.files.css['css/app.css']}`
])

Promise.all([homepage, layout]).then(([homepageHtml]) => {
  const PageElement = document.querySelector('.Page')
  const Menu = document.querySelector('.Menu')
  if (PageElement && Menu) {
    const html = PageElement.innerHTML + ' ' + homepageHtml
    //
    PageElement.innerHTML = html
    Menu.classList.add('loaded')
  }
}).then(() => {
  app.fetchInject([
    // @ts-ignore
    `${app.baseUrl}/${app.files.js['js/responsiveMenu.js']}`
  ])
})

window.app.fetchInject([
  'https://fonts.googleapis.com/css?family=$googleFonts'
]).then(() => {
  document.body.classList.add('fontsLoaded')
})
