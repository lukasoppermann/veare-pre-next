const cache = require('memory-cache')
const removeItem = require('./contentfulRemoveItem')

module.exports = (updatedItem, res) => {
  let contentTypeId = updatedItem.sys.contentType.sys.id
  let content = cache.get(contentTypeId)
  if (!content) {
    return res.status(400).json({
      'action': 'updating entry failed, content of this type does not exist',
      'entry': updatedItem
    })
  }
  // get content without updated item
  let updatedContent = removeItem(content, updatedItem)
  // place new / updated item in cache
  updatedContent.push(updatedItem)
  // update cache
  cache.put(contentTypeId, updatedContent)
  // return status OK
  return res.status(200).json({
    'action': 'entry updated',
    'entry': updatedItem
  })
}
