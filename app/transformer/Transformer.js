'use strict'
let content = []

class Transformer {
  constructor (data) {
    content = this.transformData(data)
  }

  get () {
    return content
  }

  first () {
    return content[0]
  }

  getContent (data, fieldName) {
    let field = data.fields[fieldName]
    if (typeof field !== 'object') {
      return null
    }
    return field[Object.keys(field)[0]]
  }

  transformData (data) {
    if (Array.isArray(data)) {
      let that = this
      return data.map((item) => that.transform(item))
    } else if (data !== null) {
      return [this.transform(data)]
    } else {
      return []
    }
  }

  formatDate (dateString, format) {
    let date = new Date(dateString)
    let day = ('0' + date.getDate()).slice(-2)
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    let month = ('0' + (date.getMonth() + 1)).slice(-2)
    let year = date.getFullYear()

    return `${months[parseInt(month) - 1]} ${day}, ${year}`
  }
}

module.exports = Transformer
