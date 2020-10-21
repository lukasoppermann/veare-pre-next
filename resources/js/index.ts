/* global fetchInject fetch */
// get correct file name
const revFileList = fetch('/revisionedFiles').then(response => {
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

Promise.all([revFileList, fetchInjectLoaded])
  .then(results => {
    const json = results[0]
    // load critical layout components
    const body = document.querySelector('body')
    // load webfont and view intro once downloaded
    // @ts-ignore
    fetchInject([
      'https://fonts.googleapis.com/css?family=$googleFonts'
    ])
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
    // @ts-ignore
    fetchInject([
      `${baseUrl}/${json.js['js/responsiveMenu.js']}`//,
      // `${baseUrl}/${json.js['js/rest.js']}`
    ])
  })
