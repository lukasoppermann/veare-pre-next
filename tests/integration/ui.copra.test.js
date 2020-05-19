// set current case name
const currentCase = 'copra'
// run test
describe('Testing Page: ' + currentCase, () => require('./ui.baseTest.js')(currentCase))
