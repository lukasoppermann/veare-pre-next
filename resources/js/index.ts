/* global fetchInject fetch */
import webComponentsSupported from './modules/webComponentsSupported'
// get correct file name
const revisionedFiles = fetch('/revisionedFiles').then(response => {
  return response.json()
})

const baseUrl = `${window.location.protocol}//${window.location.host}`
// get fetchInject class
const fetchInjectLoaded = new Promise((resolve, reject) => {
  const script = document.createElement('script')
  document.head.appendChild(script)
  script.onload = resolve
  script.onerror = reject
  script.async = true
  script.src = baseUrl + '/js/fetch-inject.min.js?v=$Fetch_Inject_Version'
})

Promise.all([revisionedFiles, fetchInjectLoaded])
  .then(results => {
    let json = results[0]
    console.log(json)
    // make sure WC are working
    const webComponentsAvailable = new Promise((resolve) => {
      if (!webComponentsSupported()) {
        return fetchInject([
          // polyfill
          `${baseUrl}/js/webcomponents-sd-ce.js`,
          'https://polyfill.io/v2/polyfill.min.js?features=IntersectionObserver'
        ]).then(() => {
          resolve()
        })
      }
      resolve()
    })
    // load critical layout components
    const layoutComponents = fetchInject([`${baseUrl}/${json.js['js/layoutComponents.js']}`], webComponentsAvailable)
    let body = document.querySelector('body')
    // load webfont and view intro once downloaded
    fetchInject([
      `https://fonts.googleapis.com/css?family=Montserrat:700|Noto+Serif:400,400i|Source+Sans+Pro:400,600`
    ], layoutComponents)
      .then(() => {
        if (body !== null) {
          body.style.opacity = '1'
        }
      }, () => {
        if (body !== null) {
          body.style.opacity = '1'
        }
      })

    // load responsiveMenu
    fetchInject([
      `${baseUrl}/${json.js['js/responsiveMenu.js']}`,
      `${baseUrl}/${json.js['js/toc.js']}`,
      `${baseUrl}/${json.js['js/rest.js']}`
    ], webComponentsAvailable)
      .then(() => {
        document.querySelector('responsive-menu').style.display = 'block'
      })
  })
