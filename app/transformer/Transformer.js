'use strict'

class Transformer {
  constructor (data) {
    this.data = this.transformData(data)
  }

  get () {
    return this.data
  }

  transformData (data) {
    if (Array.isArray(data)) {
      let that = this
      return data.map((item) => that.transform(item))
    } else {
      return [this.transform(data)]
    }
  }

  getField (fieldName, data) {
    let field = data.fields[fieldName]
    return field[Object.keys(field)[0]]
  }

  getLinkedObject (objectName, data) {
    let field = data.fields[fieldName]
  }

  getLinkedField (objectName, fieldname, data) {

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
