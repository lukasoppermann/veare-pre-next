'use strict'
let content = []

class Transformer {
  constructor (data) {
    content = this.transformData(data).filter(item => item !== null)
  }

  all () {
    return content
  }

  first () {
    return content[0]
  }

  getContent (data, fieldName, defaultValue = null) {
    const field = data.fields[fieldName]
    if (typeof field !== 'object') {
      return defaultValue || null
    }
    return field[Object.keys(field)[0]]
  }

  transformData (data) {
    if (!Array.isArray(data)) {
      data = [data]
    }
    return data.map((item) => this.transformOrNull(item), this)
  }

  transformOrNull (data) {
    if (data !== null && typeof data.fields === 'object') {
      return this.transform(data)
    }
    return null
  }

  formatDate (dateString) {
    const date = new Date(dateString)
    const day = ('0' + date.getDate()).slice(-2)
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const year = date.getFullYear()

    return `${months[parseInt(month) - 1]} ${day}, ${year}`
  }
}

module.exports = Transformer
