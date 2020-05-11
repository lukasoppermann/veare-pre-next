const config = require('./ui.config.js')
const uiTest = require('./ui.baseTest.js')

const currentCase = config.cases.privacy;

describe.each(config.viewports)('Testing viewport: %s', (viewport, viewportWidth, viewportHeight) => uiTest(viewport, viewportWidth, viewportHeight, currentCase))
