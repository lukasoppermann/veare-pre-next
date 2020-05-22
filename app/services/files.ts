import { revFilesInterface, filesObjectInterface } from '../../types/revFiles'
const fs = require('fs')

const retriveRevFiles = (revFiles:filesObjectInterface|undefined): filesObjectInterface => {
  if (revFiles === undefined) {
    revFiles = <filesObjectInterface>JSON.parse(fs.readFileSync('public/rev-manifest.json', 'utf8'))
  }
  // return revFiles as filesObjectInterface
  return revFiles
}

// get revisioned files in object
const getRevFiles = (revFilesParam:filesObjectInterface|undefined = undefined): revFilesInterface => {
  // get revisioned files
  const revFiles = retriveRevFiles(revFilesParam)
  // create files structure
  const files = {
    css: {},
    js: {},
    media: {}
  }
  // add revisioned files to structure
  Object.keys(revFiles).map(key => {
    files[key.slice(0, key.indexOf('/'))][key] = revFiles[key]
  })
  // return object
  return files
}
// set revisionedFiles
let revisionedFiles = getRevFiles()

const getFile = file => {
  // revisionedFiles
}

module.exports = (refresh: boolean = false): revFilesInterface => {
  // if refresh is true, refresh revisioned files
  if (refresh !== false) {
    revisionedFiles = getRevFiles()
  }
  // return files
  return revisionedFiles
}
