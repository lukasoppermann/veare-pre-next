module.exports = function (templates, data) {
  const gulp = require('gulp')
  const dust = require('gulp-dust-html')
  const error = require('./errorHandling.js')()
  const fs = require('fs')

  return (build) => function html () {
    let files = JSON.parse(fs.readFileSync('public/rev-manifest.json', 'utf8'))
    if (build === true) {
      Object.keys(files).map(function (key, index) {
        data[key.replace('.', '_').replace(/^[a-z]+\//, '')] = files[key]
      })
    } else {
      delete files['js/registerServiceWorker.js']
      Object.keys(files).map(function (key, index) {
        data[key.replace('.', '_').replace(/^[a-z]+\//, '')] = key
      })
    }

    return gulp.src(templates)
      .pipe(dust({
        basePath: 'resources/templates',
        whitespace: true,
        data: data,
        config: {
          cache: false
        }
      }))
      .on('error', error)
      .pipe(gulp.dest('public'))
  }
}
