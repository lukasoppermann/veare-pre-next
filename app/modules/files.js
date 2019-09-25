const fs = require('fs')

module.exports = () => {
  // get revisioned filenames
  const revFiles = JSON.parse(fs.readFileSync('public/rev-manifest.json', 'utf8'))
  // predefine structure
  const files = {
    css: {},
    js: {},
    media: {}
  }
  // add revisioned files to structure
  Object.keys(revFiles).map(key => {
    files[key.slice(0, key.indexOf('/'))][key] = revFiles[key]
  })

  return files
}
