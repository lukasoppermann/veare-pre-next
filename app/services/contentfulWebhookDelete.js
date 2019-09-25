const cache = require('memory-cache')
const removeItem = require('./contentfulRemoveItem')

module.exports = (deletedItem, res) => {
  const contentTypeId = deletedItem.sys.contentType.sys.id
  // get cached content
  const content = cache.get(contentTypeId)
  if (!content) {
    return res.status(400).json({
      action: 'deleting entry failed, content of this type does not exist',
      entry: deletedItem
    })
  }
  // get content without deleted item
  const updatedContent = removeItem(content, deletedItem.sys.id)
  // update cache
  cache.put(contentTypeId, updatedContent)
  // return status OK
  return res.status(200).json({
    action: 'deleted entry',
    entry: deletedItem
  })
}
