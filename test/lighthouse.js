const lighthouse = require('lighthouse')
const chromeLauncher = require('lighthouse/chrome-launcher')
const perfConfig = require('lighthouse/lighthouse-core/config/fast-config.js')
const PORT = process.env.NODE_PORT || 8080
/**
 * Run lighthouse
 */
function launchChromeAndRunLighthouse(url, flags, config = null) {
  return chromeLauncher.launch().then(chrome => {
    flags.port = chrome.port
    return lighthouse(url, flags, config).then(results =>
      chrome.kill().then(() => results)
    )
  })
}

const flags = {}

launchChromeAndRunLighthouse(`http://localhost:${PORT}`, flags, perfConfig)
    .then((results) => {
      console.log('\nLighthouse Results:\n')
      let reports = []
      for(i = 0; i < 4; i++){
        reports.push({
          name: results.reportCategories[i]['name'],
          score: results.reportCategories[i]['score']
        })
        console.log(results.reportCategories[i]['name'] + ': ' + results.reportCategories[i]['score'])
      }
      // console.log(results) // eslint-disable-line no-console
      if (results.audits['first-meaningful-paint'].rawValue > 3000) {
        console.log(`Warning: Time to first meaningful paint ${results.audits['first-meaningful-paint'].displayValue}`);
        process.exit(1);
      }
    })
    .catch((e) => {
      console.error(e) // eslint-disable-line no-console
      throw e // Throw to exit process with status 1.
    })
