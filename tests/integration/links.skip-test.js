/* global test expect jest */
const checkLinks = require('check-links')
// const request = require('request')
const links = (base) => [
  // `${base}/`,
  // `${base}/blog`,
  // `${base}/blog/make-npm-your-build-tool`,
  // `${base}/work`,
  // `${base}/work/nyon`,
  // `${base}/work/copra`,
  // `${base}/portfolio`,
  // `${base}/portfolio/open-everything`,
  // `${base}/portfolio/swift`,
  // `${base}/portfolio/decks`,
  // `${base}/privacy`,
  // // missing
  // `${base}/work/missing`,
  // // `${base}/blog/missing`,
  // `${base}/page-missing`
]
const port = '3300'
const host = 'http://127.0.0.1'

beforeAll(() => {
  console.info(`Testing on ${host}:${port}`)
})
links(`${host}:${port}`).forEach(link => {
  test(`testing ${link.replace(`${host}:${port}`,'')}`, async () => {
    jest.setTimeout(20000)
    const result = await checkLinks([link])
    expect(result[link].status).toBe('alive')
  })
})
