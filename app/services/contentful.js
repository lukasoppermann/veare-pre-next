const client = require('./client')
const cache = require('./cacheService')()

const contentful = (cb, errorFn = console.error) => {
  // get all entries
  let entriesPromise = client.getEntries({
    limit: 1000,
    order: 'sys.createdAt',
    locale: '*'
  }).then((response) => {
    return response
  })
  // get all content types
  let contentTypesPromise = client.getContentTypes().then((res) => {
    return res
  })

  Promise.all([entriesPromise, contentTypesPromise]).then((values) => {
    let [entries, contentTypes] = values
    initializeContent(contentTypes, entries, cb)
  }).catch(errorFn)
}

const initializeContent = (types, entries, cb) => {
  // get type ids
  if (types !== undefined) {
    let typeIds = types.items.map((item) => item.sys.id)
    // get content by type
    typeIds.forEach((contentTypeId) => {
      let content = entries.items.filter((entry) => {
        return entry.sys.contentType.sys.id === contentTypeId
      })
      cache.put(contentTypeId, content)
    })
  } else {
    throw new Error('No types array provided to initializeContent function.')
  }
  cb()
}

module.exports = contentful
