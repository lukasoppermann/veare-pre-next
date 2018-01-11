const pwaManifest = require('@pwa/manifest')

module.exports = (revFiles) => {
  return () => {
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
          src: revFiles['media/veare-icon-48.png'],
          type: 'image/png',
          sizes: '48x48'
        },
        {
          src: revFiles['media/veare-icon-72.png'],
          type: 'image/png',
          sizes: '72x72'
        },
        {
          src: revFiles['media/veare-icon-96.png'],
          type: 'image/png',
          sizes: '96x96'
        },
        {
          src: revFiles['media/veare-icon-144.png'],
          type: 'image/png',
          sizes: '144x144'
        },
        {
          src: revFiles['media/veare-icon-192.png'],
          type: 'image/png',
          sizes: '192x192'
        },
        {
          src: revFiles['media/veare-icon-512.png'],
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
