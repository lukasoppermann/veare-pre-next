const cache = require('memory-cache')

const contentfulWebhook = (request, res) => {
  // extract action (e.g. publish) and resourceType (e.g. Entry or Asset) from header
  let [, resourceType, action] = request.header('X-Contentful-Topic').split('.')
  //
  if (resourceType === 'Entry' && action === 'publish') {
    res.sendStatus(updateContent(request.body))
  }
  if (resourceType === 'Entry' && ['unpublish', 'archive', 'delete'].indexOf(action) > -1) {
    res.sendStatus(deleteContent(request.body))
  }
}

const updateContent = (updatedItem) => {
  let contentTypeId = updatedItem.sys.contentType.sys.id
  // get content without updated item
  let content = removeItem(contentTypeId, updatedItem)
  // place new / updated item in cache
  content.push(updatedItem)
  // update cache
  cache.put(contentTypeId, content)
  // return status OK
  return 200
}

const deleteContent = (updatedItem) => {
  let contentTypeId = updatedItem.sys.contentType.sys.id
  // get content without deleted item
  let content = removeItem(contentTypeId, updatedItem)
  // update cache
  cache.put(contentTypeId, content)
  // return status OK
  return 200
}

const removeItem = (contentTypeId, removeItem) => {
  // get cached content
  let content = cache.get(contentTypeId)
  // // search for item in cache
  let index = content.findIndex((item) => item.sys.id === removeItem.sys.id)
  // remove if item exist
  if (index > -1) {
    content.splice(index, 1)
  }
  // return content
  return content
}

module.exports = contentfulWebhook
