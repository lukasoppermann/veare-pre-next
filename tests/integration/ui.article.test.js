// set current case name
const currentCase = 'article'
// run test
describe('Testing Page: ' + currentCase, () => require('./ui.baseTest.js')(currentCase))
