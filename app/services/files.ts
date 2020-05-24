import { revFilesInterface, filesObjectInterface } from '../../types/revFiles'
const fs = require('fs')
// variable to store revisioned files
const revisionedFilesObject: revFilesInterface = {
  css: {},
  js: {},
  media: {}
}
/**
 * get revisioned file object
 * @method default
 * @param  refresh [description]
 * @return         [description]
 */
export const revisionedFiles = (revFiles:filesObjectInterface|null = null): revFilesInterface => {
  // if refresh is true, refresh revisioned files
  if (revFiles !== null) {
    // add revisioned files to structure
    Object.keys(revFiles).map(key => {
      revisionedFilesObject[key.slice(0, key.indexOf('/'))][key] = revFiles[key]
    })
  }
  // return files
  return revisionedFilesObject
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
  if (Object.prototype.hasOwnProperty.call(revisionedFilesObject, folder) && Object.prototype.hasOwnProperty.call(revisionedFilesObject[folder], filename)) {
    // return revisioned filename string
    return revisionedFilesObject[folder][filename]
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
