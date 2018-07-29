const cache = require('memory-cache')
const removeItem = require('./contentfulRemoveItem')
const updateContent = require('./contentfulWebhookPublish')

module.exports = (request, res) => {
  // extract action (e.g. publish) and resourceType (e.g. Entry or Asset) from header
  let [, resourceType, action] = request.header('X-Contentful-Topic').split('.')
  //
  if (resourceType === 'Entry' && action === 'publish') {
    return updateContent(request.body, res)
  }
  if (resourceType === 'Entry' && ['unpublish', 'archive', 'delete'].indexOf(action) > -1) {
    return deleteContent(request.body, res)
  }
  if (resourceType === 'ContentType') {
    return res.status(200).json({
      'action': 'Updates to ContentType are ignored',
      'entry': request.body
    })
  }
  if (resourceType === 'Asset') {
    return res.status(200).json({
      'action': 'Updates to Assets are ignored',
      'entry': request.body
    })
  }
}

const deleteContent = (updatedItem, res) => {
  let contentTypeId = updatedItem.sys.contentType.sys.id
  // get cached content
  let content = cache.get(contentTypeId)
  if (!content) {
    return res.status(400).json({
      'action': 'deleting entry failed, content of this type does not exist',
      'entry': updatedItem
    })
  }
  // get content without deleted item
  let updatedContent = removeItem(content, updatedItem)
  // update cache
  cache.put(contentTypeId, updatedContent)
  // return status OK
  return res.status(200).json({
    'action': 'deleted entry',
    'entry': updatedItem
  })
}
