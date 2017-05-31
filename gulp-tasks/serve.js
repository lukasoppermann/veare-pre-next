/* ------------------------------
 *
 * live reload
 *
 */
module.exports.serve = () => {
  const forever = require('gulp-forever-monitor')
  const pack = require('../package.json')

  return () => {

    var foreverMonitorOptions = {
      env: process.env,
      args: process.argv,
      watch: true,
      watchIgnorePatterns: ['node_modules/**', 'public/**']
    }

    forever(pack.main, foreverMonitorOptions)
    .on('watch:restart', function(fileInfo) {
      console.log('server was restarted');
    })
    .on('exit', function() {
      console.log('server was closed');
    })
  }
}
