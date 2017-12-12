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
  const layoutComponents = fetchInject([`/${json['js/layoutComponents.js']}`], webComponentsAvailable);
  // load webfont and view intro once downloaded
  fetchInject([
    `https://fonts.googleapis.com/css?family=Noto+Serif:400,400i|Source+Sans+Pro:400,600`
  ], layoutComponents)
  .then(() => {
    if(document.querySelector('.c-section--intro') !== null) {
      document.querySelector('.c-section--intro').style.opacity = "1"
    }
  }, () => {
    if(document.querySelector('.c-section--intro') !== null) {
      document.querySelector('.c-section--intro').style.opacity = "1"
    }
  })

  // load responsiveMenu
  fetchInject([
    `/${json['js/responsiveMenu.js']}`,
    `/${json['js/rest.js']}`
  ], webComponentsAvailable)
  .then(() => {
    document.querySelector('responsive-menu').style.display = "block"
  })
})
