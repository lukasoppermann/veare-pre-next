const client = require('./client')
const cache = require('memory-cache')

const contentful = (cb, errorFn = console.error) => {
  client.sync({
    initial: true
  })
  .then((response) => {
    cache.put('nextSyncToken', response.nextSyncToken)
    const responseObj = JSON.parse(response.stringifySafe())
    client.getContentTypes()
    .then((types) => {
      initializeContent(types, responseObj, cb)
    }).catch(console.error)
  })
  .catch(errorFn)
}

const initializeContent = (types, responseObj, cb) => {
  // get type ids
  let typeIds = types.items.map((item) => item.sys.id)
  // get content by type
  typeIds.forEach((contentTypeId) => {
    let content = responseObj.entries.filter((entry) => {
      return entry.sys.contentType.sys.id === contentTypeId
    })
    cache.put(contentTypeId, content)
  })
  cb()
}

module.exports = contentful
