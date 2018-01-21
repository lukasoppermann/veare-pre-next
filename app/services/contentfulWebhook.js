const cache = require('memory-cache')

const contentfulWebhook = (request, res) => {
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

const updateContent = (updatedItem, res) => {
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

const removeItem = (content, removeItem) => {
  // search for item in cache
  let index = content.findIndex((item) => item.sys.id === removeItem.sys.id)
  // remove if item exist
  if (index > -1) {
    content.splice(index, 1)
  }
  // return content
  return content
}

module.exports = contentfulWebhook
