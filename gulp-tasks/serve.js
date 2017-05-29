/* ------------------------------
 *
 * live reload
 *
 */
module.exports.serve = () => {
  const nodemon = require('gulp-nodemon')
  const pack = require('../package.json')

  return () => {
    nodemon({
      verbose: true,
      script: pack.main,
      watch: [pack.main, 'app/*.js', 'app/*/*.js', 'app/*/*/*.js'],
      delay: '1000'
    }).once('quit', () => {
      process.exit()
    })
  }
}
