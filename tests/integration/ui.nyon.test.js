// set current case name
const currentCase = 'nyon'
// run test
describe('Testing Page: ' + currentCase, () => require('./ui.baseTest.js')(currentCase))
