// set current case name
const currentCase = 'blog'
// run test
describe('Testing Page: ' + currentCase, () => require('./ui.baseTest.js')(currentCase))
