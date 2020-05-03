const fs = require('fs')
const puppeteer = require('puppeteer')
const { toMatchImageSnapshot } = require('jest-image-snapshot')

jest.setTimeout(30000);
let basePath = process.env.SNAPSHOT_PATH  || __dirname
let browser
let page
const viewportHeight = 900
const viewportWidth = 1680
const testCases = [
  ['/home', 'home', 8],
  ['/work/nyon', 'work-nyon', 19],
  ['/work/copra', 'work-copra', 15],
  ['/privacy', 'privacy', 16],
  ['/blog', 'blog', 3]
]

// create screenshots folder
const screenshotsFolder = `${basePath}/test_snaps`
if (!fs.existsSync(screenshotsFolder)){
    console.debug(`Creating directory: ${screenshotsFolder}`)
    fs.mkdirSync(screenshotsFolder)
}

testCases.forEach(item => {
  let dir = `${screenshotsFolder}/${item[1]}`
  if (!fs.existsSync(dir)){
      console.debug(`Creating directory: ${dir}`)
      fs.mkdirSync(dir)
  }
})

// jest-image-snapshot custom configuration in order to save screenshots and compare the with the baseline
function setConfig (opts) {

  return {
    customDiffConfig: {
      threshold: 0.01
    },
    customDiffDir: opts.diffPath,
    customSnapshotsDir: opts.snapshotPath,
    customSnapshotIdentifier: opts.filename,
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
  })
})

describe.each(testCases)('Testing: %s', (link, folder, count) => {

  beforeAll(async () => {
    await page.goto(`http://localhost:3300${link}`)
    await page.evaluate(() => {
      window.scrollTo(0, Number.MAX_SAFE_INTEGER)
    })
    await page.waitFor(1000)
    await page.evaluate(() => {
      window.scrollBy(0, 0)
    })
    await page.waitFor(1000)
  });

  test.each(Array.from(Array(count), (_, i) => i))('Taking screenshot #%i', async i => {
    let scrollHeight = i * viewportHeight
    await page.evaluate(scrollHeight => {
      window.scrollTo(0, scrollHeight)
    }, scrollHeight)
    let image = await page.screenshot({ path: `${screenshotsFolder}/${folder}/screenshot-${i}.png`})
    expect(image).toMatchImageSnapshot(setConfig({
      filename: `screenshot-${i}`,
      snapshotPath: `${basePath}/tests/integration/baseline/${folder}`,
      diffPath: `${screenshotsFolder}/${folder}`
    }))
  }, 15000)

})


afterAll(async () => {
  await browser.close()
})
