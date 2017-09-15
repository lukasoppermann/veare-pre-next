const check = require('check-broken-links')
const containsBroken = [
  'http://localhost:8080/blog',
  'http://localhost:8080/',
  'http://localhost:8080/'

]
check('http://localhost:8080/', containsBroken).then(brokenlinks => {
  if (brokenlinks.crawled.length > 0) {
    console.log(brokenlinks.crawled)
    return false
  }
  return true
})
