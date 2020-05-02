const fs = require('fs')
const puppeteer = require('puppeteer')
const { toMatchImageSnapshot } = require('jest-image-snapshot')

jest.setTimeout(30000);

let browser
let page
const viewportHeight = 900
const viewportWidth = 1680
const testCases = [
  ['/home', 8],
  ['/work/nyon', 19],
  ['/work/copra', 15],
  ['/privacy', 16],
  ['/blog', 3]
]

testCases.forEach(item => {
  let dir = `${__dirname}/../screenshots${item[0]}`
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir)
  }
})

// jest-image-snapshot custom configuration in order to save screenshots and compare the with the baseline
function setConfig (filename, path) {
  return {
    failureThreshold: '0.01',
    failureThresholdType: 'percent',
    customSnapshotsDir: path,
    customSnapshotIdentifier: filename,
    noColors: true
  }
}

beforeAll(async () => {
  // start Puppeteer with a custom configuration, see above the setup
  browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  expect.extend({ toMatchImageSnapshot })
  page = await browser.newPage()
  await page.setViewport({
    width: viewportWidth,
    height: viewportHeight,
    deviceScaleFactor: 1
  });
});

describe.each(testCases)('Testing: %s', (link, count) => {

  beforeAll(async () => {
    await page.goto(`http://localhost:3300${link}`)
    await page.evaluate(() => {
      window.scrollTo(0, Number.MAX_SAFE_INTEGER)
    })
    await page.waitFor(4000)
    await page.evaluate(() => {
      window.scrollBy(0, 0)
    })
    await page.waitFor(4000)
  });

  test.each(Array.from(Array(count), (_, i) => i))('Taking screenshot #%i', async i => {
    let scrollHeight = i * viewportHeight
    await page.evaluate(scrollHeight => {
      window.scrollTo(0, scrollHeight)
    }, scrollHeight)
    let image = await page.screenshot({ path: `${__dirname}/../screenshots${link}/screenshot-${i}.png`})
    expect(image).toMatchImageSnapshot(setConfig(`screenshot-${i}`, `${__dirname}/../screenshots${link}/snaps/`))
  }, 15000)

})

// describe('/work/nyon', () => {
//
//   beforeAll(async () => {
//     await page.goto('http://localhost:3300/work/nyon')
//     await page.evaluate(() => {
//       window.scrollTo(0, Number.MAX_SAFE_INTEGER)
//     })
//     await page.waitFor(4000)
//     await page.evaluate(() => {
//       window.scrollBy(0, 0)
//     })
//     await page.waitFor(4000)
//   });
//
//   test.each(Array.from(Array(19), (_, i) => i))('Taking screenshot #%i', async i => {
//     let scrollHeight = i * viewportHeight
//     await page.evaluate(scrollHeight => {
//       window.scrollTo(0, scrollHeight)
//     }, scrollHeight)
//     let image = await page.screenshot({ path: `${__dirname}/../screenshots/work-nyon-${i}.png`})
//     expect(image).toMatchImageSnapshot(setConfig(`screenshot-${i}`))
//   }, 15000)
//
// })

afterAll(async () => {
  await browser.close()
})
