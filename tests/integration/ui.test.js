const puppeteer = require('puppeteer')
const { toMatchImageSnapshot } = require('jest-image-snapshot')

const browserConfig = {
  ignoreHTTPSErrors: true,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
}

// jest-image-snapshot custom configuration in order to save screenshots and compare the with the baseline
function setConfig (filename) {
  return {
    failureThreshold: '0.01',
    failureThresholdType: 'percent',
    customSnapshotsDir: `${__dirname}/../snapshots/`,
    customSnapshotIdentifier: filename,
    noColors: true
  }
}

describe('screenshot', () => {
  let browser;

  beforeAll(async () => {
  // start Puppeteer with a custom configuration, see above the setup
  browser = await puppeteer.launch(browserConfig);
  expect.extend({ toMatchImageSnapshot })
  });

  it('dummy application page', async () => {
    const page = await browser.newPage()
    await page.setViewport({
      width: 1680,
      height: 900,
      deviceScaleFactor: 1,
    });

    await page.goto('http://localhost:3300/work/nyon')
    await page.waitFor(4000)
    const height = await page.evaluate(() => document.documentElement.offsetHeight)
    const shotCount = Math.ceil(height/900)
    console.debug('shotCount:',shotCount, height)
    // await page.evaluate(() => window.scrollTo(0, Number.MAX_SAFE_INTEGER/900));
    for(let i = 0; i < shotCount; i++ ) {
      await page.evaluate((i) => window.scrollTo(0, 900*i))
      await page.waitFor(2000)
      let image = await page.screenshot({ path: `${__dirname}/../snapshots/screenshot-${i}.png`, clip: {
        x:0,
        y: i*900,
        width:1680,
        height: 900
      } })
    }
    // const image = await page.screenshot({ fullPage: false })
    // expect(image).toMatchImageSnapshot(setConfig('image-name'))
  }, 15000);

  afterAll(async () => {
    await browser.close()
  })
})
