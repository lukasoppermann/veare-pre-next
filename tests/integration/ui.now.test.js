// set current case name
const currentCase = 'now'
// run test
describe('Testing Page: ' + currentCase, () => require('./ui.baseTest.js')(currentCase))
