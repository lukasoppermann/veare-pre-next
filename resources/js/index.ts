/* global fetchInject */
import {default as webComponentsSupported} from './modules/wcSupported'
// get correct file name
const revisionedFiles = fetch('/revisionedFiles').then(response => {
  return response.json()
})
const baseUrl = window.location.protocol+'//'+window.location.host
// get fetchInject class
const scriptPromise = new Promise((resolve, reject) => {
  const script = window.document.createElement('script');
  window.document.head.appendChild(script);
  script.onload = resolve;
  script.onerror = reject;
  script.async = true;
  script.src = baseUrl + '/js/fetch-inject.min.js?v=1.9.1';
})

Promise.all([revisionedFiles, scriptPromise])
.then(results => {
  let json = results[0]
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
  const layoutComponents = fetchInject([`${baseUrl}/${json['js/layoutComponents.js']}`], webComponentsAvailable)
  let body = document.querySelector('body')
  // load webfont and view intro once downloaded
  fetchInject([
    `https://fonts.googleapis.com/css?family=Montserrat:700|Noto+Serif:400,400i|Source+Sans+Pro:400,600`
  ], layoutComponents)
  .then(() => {
    if(body !== null) {
      body.style.opacity = "1"
    }
  }, () => {
    if(body !== null) {
      body.style.opacity = "1"
    }
  })

  // load responsiveMenu
  fetchInject([
    `${baseUrl}/${json['js/responsiveMenu.js']}`,
    `${baseUrl}/${json['js/nucleiButton.js']}`,
    `${baseUrl}/${json['js/toc.js']}`,
    `${baseUrl}/${json['js/rest.js']}`
  ], webComponentsAvailable)
  .then(() => {
    document.querySelector('responsive-menu').style.display = "block"
  })
})
