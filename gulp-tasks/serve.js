/* ------------------------------
 *
 * live reload
 *
 */
module.exports.serve = () => {
  const nodemon = require('gulp-nodemon')

  return () => {
      nodemon({
        verbose: true,
        script: 'server.js',
        watch: 'server.js',
        delay: '1000'
      }).once('quit', () => {
        process.exit()
      })
    }
}
