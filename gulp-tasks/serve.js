/* ------------------------------
 *
 * live reload
 *
 */
module.exports.serve = () => {
  const nodemon = require('gulp-nodemon')

  return () => {
      nodemon({
        script: 'server.js',
        watch: 'server.js',
        delay: '1000'
      })
    }
}
