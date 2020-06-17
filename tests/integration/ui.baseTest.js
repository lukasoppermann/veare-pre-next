const puppeteer = require('puppeteer')
const { toMatchImageSnapshot } = require('jest-image-snapshot')
const config = require('./ui.config.js')
let browser
let page
let currentCase

module.exports = (caseName, beforeFn = null, testFn = null) => {
  beforeAll(async () => {
    currentCase = config.cases[caseName]
    currentCase.options = currentCase.options || {}
    // start Puppeteer with a custom configuration, see above the setup
    browser = await puppeteer.launch({
      ignoreHTTPSErrors: true,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    expect.extend({ toMatchImageSnapshot })
    // load page
    page = await browser.newPage()
    await page.goto(`http://localhost:3300${currentCase.path}`, {waitUntil: 'load'});
    // add special testing css
    await page.addStyleTag({content: `body {--max-row-height: 59px;}`})
    // scroll to bottom and back up
    await page.waitFor(1000)
    await page.evaluate(() => {
      window.scrollTo(0, Number.MAX_SAFE_INTEGER)
    })
    await page.waitFor(500)
    await page.evaluate(() => {
      window.scrollBy(0, 0)
    })
    await page.waitFor(500)
    // run fn if defined
    if (beforeFn !== null) {
      await beforeFn(page)
    }
  })

  test.each(config.viewports)(`Testing viewport: %s`, async (viewport, viewportWidth, viewportHeight) => {
    // run fn if defined
    if (testFn !== null) {
      await testFn(page, {
        name: viewport,
        width: viewportWidth,
        height: viewportHeight
      })
    }
    // set viewport
    await page.setViewport({
      width: viewportWidth,
      height: viewportHeight,
      deviceScaleFactor: 1
    })
    // add special testing css
    await page.addStyleTag({content: `
      body {
        --viewport-height: ${viewportHeight}px;
      }
    `})

    // take full screen screenshot
    let image = await page.screenshot({
      path: `${config.testSnaps}/${currentCase.folder}/${viewport}.png`,
      type: 'png',
      fullPage: currentCase.options.fullPage !== undefined ? currentCase.options.fullPage : true
    })
    // compare screenshot
    expect(image).toMatchImageSnapshot(config.setConfig({
      filename: `${viewport}`,
      snapshotPath: `${config.basePath}/baseline/${currentCase.folder}`,
      diffPath: `${config.testSnaps}/${currentCase.folder}`
    }))
  }, 15000)

  afterAll(async () => {
    await browser.close()
  })

}
