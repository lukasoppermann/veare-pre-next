/* ------------------------------
 *
 * live reload
 *
 */
module.exports.serve = () => {
  const pack = require('../package.json')
  const exec = require('child_process').execSync
  const forever = require('gulp-forever-monitor')

  return () => {
    try {
      exec('pkill node')
    } catch (err) {
      // console.log(err)
    }
    var foreverMonitorOptions = {
      env: process.env,
      args: process.argv,
      watch: true,
      watchIgnorePatterns: ['node_modules/**', 'public/**']
    }

    forever(pack.main, foreverMonitorOptions)
      .on('watch:restart', function (fileInfo) {
        console.log('server was restarted')
      })
      .on('exit', function () {
        console.log('server was closed')
      })
  }
}
