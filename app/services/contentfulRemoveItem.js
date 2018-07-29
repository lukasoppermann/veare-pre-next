module.exports = (content, removeItem) => {
  // search for item in cache
  let index = content.findIndex((item) => item.sys.id === removeItem.sys.id)
  // remove if item exist
  if (index > -1) {
    content.splice(index, 1)
  }
  // return content
  return content
}
