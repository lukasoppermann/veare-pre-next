const client = require('./client')
const cache = require('./cacheService')()
const errorLogFn = require('./errorLog')

const contentful = async (cb, errorLog = errorLogFn) => {
  // get all entries
  const entriesPromise = client.getEntries({
    limit: 1000,
    order: 'sys.createdAt',
    locale: '*'
  }).then((response) => {
    return response
  })
  // get all content types
  const contentTypesPromise = client.getContentTypes().then((res) => {
    return res
  })

  Promise.all([entriesPromise, contentTypesPromise]).then((values) => {
    const [entries, contentTypes] = values
    initializeContent(contentTypes, entries, cb)
  }).catch(errorLog)
}

const initializeContent = (types, entries, cb) => {
  // get type ids
  if (types !== undefined) {
    const typeIds = types.items.map((item) => item.sys.id)
    // get content by type
    typeIds.forEach((contentTypeId) => {
      const content = entries.items.filter((entry) => {
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
