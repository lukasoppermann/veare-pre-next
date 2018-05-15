module.exports = function (bundles, directory) {
  const gulp = require('gulp')
  const changed = require('gulp-changed')
  const error = require('./errorHandling.js')()

  return function moveFiles () {
    let stream = require('merge-stream')()
    bundles.forEach(function (file) {
      stream.add(gulp.src(file)
        .on('error', error)
        .pipe(changed(directory))
        .pipe(gulp.dest(directory))
      )
    })
    return stream.isEmpty() ? null : stream
  }
}
