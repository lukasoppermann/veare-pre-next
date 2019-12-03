/* global test expect jest */
const checkLinks = require('check-links')
const links = (base) => [
  `${base}/`,
  `${base}/blog`,
  `${base}/blog/make-npm-your-build-tool`,
  `${base}/work`,
  `${base}/work/nyon`,
  `${base}/work/copra`,
  `${base}/portfolio`,
  `${base}/portfolio/open-everything`,
  `${base}/portfolio/swift`,
  `${base}/portfolio/lufthansa-germanwings`,
  `${base}/portfolio/juice-control`,
  `${base}/portfolio/decks`,
  `${base}/privacy`
]

test('all links are reachable', async () => {
  jest.setTimeout(20000)
  const port = process.env.NODE_PORT || '8080'
  const host = 'http://127.0.0.1'
  console.log(`Testing on ${host}:${port}${links('').map(item => '\n' + item)}`)
  let results = await checkLinks(links(`${host}:${port}`))
  results = Object.entries(results).map(item => {
    return Object.assign({
      url: item[0]
    }, item[1])
  })
  console.log(results.filter(link => link.status !== 'alive'))
  // assertion
  expect(results.filter(link => link.status !== 'alive').length).toBe(0)
})
