import { revFilesInterface, filesObjectInterface } from '../../types/revFiles'
const fs = require('fs')
// variable to store revisioned files
const revisionedFiles: revFilesInterface = {
  css: {},
  js: {},
  media: {}
}
/**
 * getRevFiles
 * @description get revisioned files in object
 * @param  revFilesParam   [description]
 * @return                 [description]
 */
// get revisioned files in object
const indexRevFiles = (revFilesParam:filesObjectInterface|undefined = undefined): void => {
  // get revisioned files
  const revFiles = revFilesParam !== undefined ? revFilesParam : <filesObjectInterface>JSON.parse(fs.readFileSync('public/rev-manifest.json', 'utf8'))
  // add revisioned files to structure
  Object.keys(revFiles).map(key => {
    revisionedFiles[key.slice(0, key.indexOf('/'))][key] = revFiles[key]
  })
}
/**
 * get revisioned file object
 * @method default
 * @param  refresh [description]
 * @return         [description]
 */
export default (refresh: boolean = false): revFilesInterface => {
  // if refresh is true, refresh revisioned files
  if (refresh !== false) {
    indexRevFiles()
  }
  // return files
  return revisionedFiles
}
/**
 * revFile
 * @description get revisioned filename as a string
 * @param  filename
 * @return revisioned filename string
 */
export const revFile = (filename: string): string|null => {
  // get folder from beginning of filename
  const folder = filename.split('/')[0]
  // check if folder and filename exist in object
  if (Object.prototype.hasOwnProperty.call(revisionedFiles, folder) && Object.prototype.hasOwnProperty.call(revisionedFiles[folder], filename)) {
    // return revisioned filename string
    return revisionedFiles[folder][filename]
  }
  // return null
  return null
}

/**
 * embedFile
 * @description embed a revisioned or non-revisioned file
 * @param  filename
 * @return embed file
 */
export const embedFile = (filename: string): string|void => {
  // get rev filename
  const getFilename = revFile(filename)
  // if revisioned file is available get it
  if (getFilename !== null) {
    filename = getFilename
  }
  // check if file exists
  if (fs.existsSync(filename)) {
    return fs.readFileSync(filename)
  }
}

export const __testing = {
  indexRevFiles: indexRevFiles
}
// set revisionedFiles
indexRevFiles()
