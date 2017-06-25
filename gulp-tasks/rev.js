module.exports = function (type, files) {
  const gulp = require('gulp')
  const rev = require('gulp-rev')
  const revdel = require('gulp-rev-delete-original')
  const fs = require('fs')
  const del = require('del')
  const error = require('./errorHandling.js')()

  return () => {
    // synchronously delete old files
    if (fs.existsSync('public/rev-manifest.json')) {
      let manifest = fs.readFileSync('public/rev-manifest.json', 'utf8')
      let removeFiles = Object.values(JSON.parse(manifest)).filter(function(file){
        return (file.substring(0, type.length) === type);
      })
      del.sync(removeFiles, {'cwd': 'public/'})
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
