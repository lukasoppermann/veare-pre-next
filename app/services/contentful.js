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
    if(process.env.NODE_ENV !== 'testing'){
      console.log('⚠️  Not dealing with deleted records yet!!!!')
    }
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
  .catch((error) => {
    console.log(error)
  })
}

const initializeContent = (types, responseObj, cb) => {
  let content = prepareResponse(types.items.map((item) => item.sys.id), responseObj)
  for (var key in content.added) {
    if (content.added.hasOwnProperty(key)) {
      cache.put(key, content.added[key])
    }
  }

  cb()
}

const updateContent = (types, responseObj, cb) => {
  console.log('⚠️  Work with data provided by webhook instead of doing a sync')
  let updates = prepareResponse(types.items.map((item) => item.sys.id), responseObj)
  // update content
  // key is something like 'post' or 'category'
  for (let key in updates.added) {
    // get content
    let content = cache.get(key)
    // add new items
    if (updates.added.hasOwnProperty(key)) {
      content = content.concat(updates.added[key])
    }
    // removed deleted items
    content = content.filter((item) => {
      return typeof updates.deleted.find((deleted) => {
        return deleted.sys.id === item.sys.id
      }) === 'undefined'
    })
    // update cache with updated content
    cache.put(key, content)
  }

  cb(updates)
}

const prepareResponse = (types, responseObj) => {
  let response = {
    added: {},
    deleted: {}
  }
  // add new items by contentType
  types.forEach((contentTypeId) => {
    response.added[contentTypeId] = responseObj.entries.filter((entry) => {
      return entry.sys.contentType.sys.id === contentTypeId
    })
  })
  // add delete items, which have no contentType
  response.deleted = responseObj.deletedEntries

  return response
}

module.exports = contentful
