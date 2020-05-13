const puppeteer = require('puppeteer')
const { toMatchImageSnapshot } = require('jest-image-snapshot')
const config = require('./ui.config.js')
let browser
let page

module.exports = (viewport, viewportWidth, viewportHeight, currentCase) => {
  beforeAll(async () => {
    // start Puppeteer with a custom configuration, see above the setup
    browser = await puppeteer.launch({
      ignoreHTTPSErrors: true,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    expect.extend({ toMatchImageSnapshot })
    page = await browser.newPage()

    await page.goto(`http://localhost:3300${currentCase.path}`)
    await page.evaluate(() => {
      window.scrollTo(0, Number.MAX_SAFE_INTEGER)
    })
    await page.waitFor(500)
    await page.evaluate(() => {
      window.scrollBy(0, 0)
    })
    await page.waitFor(500)
  })

  test.each(Array.from(Array(currentCase.sections), (_, i) => i))(`Screenshot: ${currentCase.path} %i of ${currentCase.sections}`, async i => {
    // reset port
    await page.setViewport({
      width: viewportWidth,
      height: viewportHeight,
      deviceScaleFactor: 1
    })
    // wait for css to adjust
    await page.waitFor(500)
    // set scroll location
    let scrollHeight = i * viewportHeight
    // scroll
    await page.evaluate(scrollHeight => {
      window.scrollTo(0, scrollHeight)
    }, scrollHeight)
    // take screenshot
    let image = await page.screenshot({
      path: `${config.testSnaps}/${currentCase.folder}/${viewport}-${i}.png`,
      type: 'png'
    })
    // compare screenshot
    expect(image).toMatchImageSnapshot(config.setConfig({
      filename: `${viewport}-${i}`,
      snapshotPath: `${config.basePath}/baseline/${currentCase.folder}`,
      diffPath: `${config.testSnaps}/${currentCase.folder}`
    }))
  }, 15000)

  afterAll(async () => {
    await browser.close()
  })

}
