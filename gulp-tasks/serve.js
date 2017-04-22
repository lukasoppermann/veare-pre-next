/* ------------------------------
 *
 * live reload
 *
 */
module.exports.serve = (refresh) => {
  const nodemon = require('gulp-nodemon')

  return () => {
    refresh.listen()
      nodemon({
        script: 'server.js',
        watch: 'server.js',
        delay: '1000'
      })
      .on('start', function () {
        setTimeout(function () {
          refresh()
        }, 2000) // wait for the server to finish loading before restarting the browsers
      })
    }
}
/* ------------------------------
 * refresh server
 */
module.exports.refresh = (refresh) => {

  return (done) => {
    refresh()
    done()
  }
}
