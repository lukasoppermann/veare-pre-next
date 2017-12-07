const pwaManifest = require('@pwa/manifest')

module.exports = (revFiles) => {

  return () => {
    console.log(revFiles)
    return pwaManifest({
      name: 'veare – UI/UX design',
      short_name: 'veare',
      start_url: '/?utm_source=homescreen',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#fa9600',
      lang: 'en-US',
      icons: [
        {
          src: 'media/veare-icon.png',
          type: 'image/png',
          sizes: '48x48'
        },
        {
          src: 'media/veare-icon@1,5x.png',
          type: 'image/png',
          sizes: '72x72'
        },
        {
          src: 'media/veare-icon@2x.png',
          type: 'image/png',
          sizes: '96x96'
        },
        {
          src: 'media/veare-icon@3x.png',
          type: 'image/png',
          sizes: '144x144'
        },
        {
          src: 'media/veare-icon@4x.png',
          type: 'image/png',
          sizes: '192x192'
        },
        {
          src: 'media/veare-icon-512.png',
          type: 'image/png',
          sizes: '512x512'
        }
      ]
    }).then(function (manifest) {
      // dump new generated manifest file if you want
      pwaManifest.write('./public/', manifest)
    })
  }
}
