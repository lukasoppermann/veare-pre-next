// import {default as fetchInject} from '../../node_modules/fetch-inject/dist/fetch-inject.es.js'
// import {default as webComponentsSupported} from './modules/wcPolyfill'
// import {default as setConfig} from './modules/config'
// get a json object of revisioned files

Promise.all([revisionedFiles, scriptPromise])
.then(results => {
  let json = results[0]
  // setConfig(window)
  fetchInject([
    // critical js
    // `/${json.commonjs}`
  ]).then(() => {
    // if (!webComponentsSupported()) {
      return fetchInject([
        // polyfill
        `/js/webcomponents-sd-ce.js`
      ]).then( () => {
        console.log('WC loaded')
      })
    // }
  })
  // WC available
  .then(() => {
    return fetchInject([
      `/${json.webcomponentsjs}`
    ]).then(() => {
      console.log('ähh no')
    })
  })
  // unimportant rest
  .then(() => {
    console.log('last')
    return fetchInject([
      `/${json.restjs}`
    ])
  })
})
