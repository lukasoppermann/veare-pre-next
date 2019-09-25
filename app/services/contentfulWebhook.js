const updateContent = require('./contentfulWebhookPublish')
const deleteContent = require('./contentfulWebhookDelete')

module.exports = (request, res) => {
  // extract action (e.g. publish) and resourceType (e.g. Entry or Asset) from header
  const [, resourceType, action] = request.header('X-Contentful-Topic').split('.')
  // ENTRY is Created or Updated
  if (resourceType === 'Entry' && action === 'publish') {
    return updateContent(request.body, res)
  }
  // ENTRY is Deleted
  if (resourceType === 'Entry' && ['unpublish', 'archive', 'delete'].indexOf(action) > -1) {
    return deleteContent(request.body, res)
  }
  // IGNORE ContentType
  if (resourceType === 'ContentType') {
    return res.status(200).json({
      action: 'Updates to ContentType are ignored',
      entry: request.body
    })
  }
  // IGNORE Assets
  if (resourceType === 'Asset') {
    return res.status(200).json({
      action: 'Updates to Assets are ignored',
      entry: request.body
    })
  }
}
