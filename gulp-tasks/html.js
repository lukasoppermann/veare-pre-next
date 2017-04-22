module.exports = function (templates, data) {
  const gulp = require('gulp')
  const dust = require('gulp-dust-html')
  const error = require('./errorHandling.js')()
  const fs = require('fs')

  return function html () {
    let files = JSON.parse(fs.readFileSync('public/rev-manifest.json', 'utf8'))
    Object.keys(files).map(function (key, index) {
      data[key.replace('.', '_').replace(/^[a-z]+\//, '')] = files[key]
    })

    return gulp.src(templates)
      .pipe(dust({
        basePath: 'resources/templates',
        whitespace: true,
        data: data
      }))
      .on('error', error)
      .pipe(gulp.dest('public'))
  }
}
