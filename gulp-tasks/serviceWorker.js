module.exports = (opts) => {
  const swPrecache = require('sw-precache')

  return (done) => {
    const rootDir = opts.rootDir
    // get revisioned file version if exists in manifest
    const fileHashes = opts.revisionedFiles
    // replace url with revisioned url in urlsToPrefetch
    let urlsToPrefetch = opts.files.map(function (item) {
      // replace item with revisioned item
      if (typeof fileHashes[item] !== 'undefined') {
        return `${rootDir}/${fileHashes[item]}`
      }
      // return item if no revision is available
      return `${rootDir}/${item}`
    })
    // create service worker
    swPrecache.write(`${rootDir}/service-worker.js`, {
      staticFileGlobs: urlsToPrefetch,
      stripPrefix: rootDir,
      runtimeCaching: [{
        urlPattern: '/(.*)',
        handler: 'cacheFirst'
      }, {
        urlPattern: /\.googleapis\.com\//,
        handler: 'cacheFirst'
      }]
    }, done)
  }
}
