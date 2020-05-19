// set current case name
const currentCase = 'menu'
const beforeFn = async (page) => {
  await page.$eval('.Menu__icon', elem => elem.click())
  await page.waitFor(100)
}
const testFn = async (page, viewport) => {
  const maxCircle = viewport.width > viewport.height ? viewport.width : viewport.height;
  await page.addStyleTag({content: `
    html body .Menu__overlay {
      --max-circle: ${maxCircle}px;
    }
    html body .Menu__overlay.is-active {
      width: ${viewport.width}px;
      height: ${viewport.height}px;
    }
  `})
  await page.waitFor(3000)
}
// run test
describe('Testing Page: ' + currentCase, () => require('./ui.baseTest.js')(currentCase, beforeFn, testFn))
