module.exports = function (type, files) {
  const gulp = require('gulp')
  const rev = require('gulp-rev')
  const revdel = require('gulp-rev-delete-original')
  const fs = require('fs')
  const error = require('./errorHandling.js')()

  return () => {
    // create public/rev-manifest.json if it doesn't exist
    if (!fs.existsSync('public/rev-manifest.json') || fs.readFileSync('public/rev-manifest.json', 'utf8').length === 0) {
      fs.appendFileSync('public/rev-manifest.json', '{}', 'utf8')
    }

    return gulp.src(files, {base: 'public'})
      .on('error', error)
      .pipe(rev())
      .pipe(revdel())
      .pipe(gulp.dest('public'))
      .pipe(rev.manifest('rev-manifest.json', {
        cwd: 'public',
        merge: true
      }))
      .pipe(gulp.dest('public'))
  }
}
