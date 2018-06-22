'use strict'

const client = require('./client')
const cache = require('memory-cache')

const contentfulUpdate = (cb, error = console.error) => {
  client.sync({
    nextSyncToken: cache.get('nextSyncToken')
  })
    .then((response) => {
      // update nextSyncToken
      cache.put('nextSyncToken', response.nextSyncToken)
      // parse response
      let responseObj = JSON.parse(response.stringifySafe())
      // get available types (because items are stored in cache by content type)
      client.getContentTypes()
        .then((types) => {
          // turn array of type object into array of ids
          types = types.items.map((item) => item.sys.id)
          // prepare response
          let updates = prepareResponse(types, responseObj)
          // create content
          updateContent(updates, responseObj, cb)
          // run callback
          cb(updates)
        }).catch(console.error)
    })
    .catch(error)
}

const updateContent = (updates, responseObj) => {
  // update content
  // key is something like 'post' or 'category'
  for (let key in updates.added) {
    // get content
    let content = cache.get(key)
    // add new items
    if (updates.added.hasOwnProperty(key)) {
      updates.added[key].forEach((updatedItem) => {
        // search for item in cache
        let index = content.findIndex((item) => item.sys.id === updatedItem.sys.id)
        // remove if item exist
        if (index > -1) {
          content.splice(index, 1)
        }
        // place new / updated item in cache
        content.push(updatedItem)
      })
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

module.exports = contentfulUpdate
