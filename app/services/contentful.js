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
  let content = prepareResponse(types.items.map((item) => item.sys.id), responseObj)
  console.log(content)
  for (var key in content) {
    if (content.hasOwnProperty(key)) {
      cache.put(key, content[key])
    }
  }
  cb()
}

const prepareResponse = (types, responseObj) => {
  let response = {}
  // add new items by contentType
  types.forEach((contentTypeId) => {
    response[contentTypeId] = responseObj.entries.filter((entry) => {
      return entry.sys.contentType.sys.id === contentTypeId
    })
  })

  return response
}

module.exports = contentful
