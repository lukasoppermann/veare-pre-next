const cache = require('memory-cache')
const removeItem = require('./contentfulRemoveItem')
const client = require('./client')
// Controller

module.exports = (updatedItem, res) => {
  const contentTypeId = updatedItem.sys.contentType.sys.id
  const content = cache.get(contentTypeId)
  if (!content) {
    return res.status(400).json({
      action: 'updating entry failed, content of this type does not exist',
      entry: updatedItem
    })
  }
  // fetch entry by id with linked entries
  client.getEntries({
    'sys.id': updatedItem.sys.id,
    locale: '*',
    include: 10
  })
    .then((entry) => {
      // get content without updated item
      const updatedContent = removeItem(content, updatedItem.sys.id)
      // place new / updated item in cache
      updatedContent.push(entry.items[0])
      // update cache
      cache.put(contentTypeId, updatedContent)
      // return status OK
      return res.status(200).json({
        action: 'entry updated',
        entry: entry.items[0]
      })
    })
    .catch(console.error)
}
