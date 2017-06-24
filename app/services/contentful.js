'use strict'

const client = require('./client')
const cache = require('memory-cache')

const contentful = (initial, cb, error = console.error) => {
  let syncConf = {
    initial: true
  }
  if (initial === false) {
    syncConf = {
      nextSyncToken: cache.get('nextSyncToken')
    }
  }
  client.sync(syncConf)
  .then((response) => {
    cache.put('nextSyncToken', response.nextSyncToken)
    console.log('⚠️  Not dealing with deleted records yet!!!!')
    const responseObj = JSON.parse(response.stringifySafe())
    client.getContentTypes()
    .then((types) => {
      if (initial === true) {
        initializeContent(types, responseObj, cb)
      } else {
        updateContent(types, responseObj, cb)
      }
    }).catch(console.error)
  })
  .catch(error)
}

const initializeContent = (types, responseObj, cb) => {
  let content = prepareResponse(types.items.map((item) => item.sys.id), responseObj)
  for (var key in content) {
    if (content.hasOwnProperty(key)) {
      cache.put(key, content[key])
    }
  }

  cb(content)
}

const updateContent = (types, responseObj, cb) => {
  console.log('⚠️  Work with data provided by webhook instead of doing a sync')
  let content = prepareResponse(types.items.map((item) => item.sys.id), responseObj)
  for (var key in content) {
    if (content.hasOwnProperty(key)) {
      cache.put(key, cache.get(key).concat(content[key]))
    }
  }
  return content
}

const prepareResponse = (types, responseObj) => {
  let response = {}
  types.forEach((contentTypeId) => {
    response[contentTypeId] = responseObj.entries.filter((entry) => {
      return entry.sys.contentType.sys.id === contentTypeId
    })
  })
  return response
}

module.exports = contentful
