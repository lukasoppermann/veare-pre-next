'use strict'

const Transformer = require('./Transformer')

class AssetTransformer extends Transformer {
  transform (data) {
    // // abort if no header
    // if (typeof data.fields !== 'object') {
    //   return null
    // }
    // get file
    let file = this.getContent(data, 'file')

    return {
      id: data.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        title: this.getContent(data, 'title'),
        description: this.getContent(data, 'description'),
        url: file.url,
        fileName: file.fileName,
        details: file.details,
        contentType: file.contentType,
        resolution: this.getResolution(file.fileName)
      }
    }
  }
  /**
   * Extract resolution from filename
   */
  getResolution (file, defaultResolution = 1) {
    let fileName = file.split('.').slice(0, -1)[0]
    let fileResolution = parseInt(fileName.substring(fileName.lastIndexOf('@') + 1, fileName.lastIndexOf('@') + 2))

    if (Number.isInteger(fileResolution)) {
      return fileResolution
    }

    return defaultResolution
  }
}

module.exports = AssetTransformer
