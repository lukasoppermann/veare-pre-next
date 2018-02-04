/* global fetchInject */
import {default as webComponentsSupported} from './modules/wcSupported'
// get correct file name
const revisionedFiles = fetch('/revisionedFiles').then(response => {
  return response.json()
})
// get fetchInject class
const scriptPromise = new Promise((resolve, reject) => {
  const script = window.document.createElement('script');
  window.document.head.appendChild(script);
  script.onload = resolve;
  script.onerror = reject;
  script.async = true;
  script.src = '/js/fetch-inject.min.js?v=1.9.1';
})

Promise.all([revisionedFiles, scriptPromise])
.then(results => {
  let json = results[0]
  // make sure WC are working
  const webComponentsAvailable = new Promise((resolve) => {
    if (!webComponentsSupported()) {
      return fetchInject([
        // polyfill
        `/js/webcomponents-sd-ce.js`
      ]).then(() => {
        resolve()
      })
    }
    resolve()
  })
  // load critical layout components
  const layoutComponents = fetchInject([`/${json['js/layoutComponents.js']}`], webComponentsAvailable)
  let body = document.querySelector('body')
  // load webfont and view intro once downloaded
  fetchInject([
    `https://fonts.googleapis.com/css?family=Montserrat:600,700|Noto+Serif:400i|Source+Sans+Pro`
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
    `/${json['js/responsiveMenu.js']}`,
    `/${json['js/nucleiButton.js']}`,
    `/${json['js/rest.js']}`
  ], webComponentsAvailable)
  .then(() => {
    document.querySelector('responsive-menu').style.display = "block"
  })
})
