module.exports = function (bundles) {
  const gulp = require('gulp')
  const sourcemaps = require('gulp-sourcemaps')
  const cleanCSS = require('gulp-clean-css')
  const concat = require('gulp-concat')
  const error = require('./errorHandling.js')()
  const sass = require('gulp-sass')
  sass.compiler = require('node-sass')

  return function bundleCss () {
    let stream = require('merge-stream')()
    Object.keys(bundles).forEach(function (key) {
      stream.add(gulp.src(bundles[key])
        .pipe(sourcemaps.init())
        .pipe(concat(key + '.css'))
        .pipe(sass({
          outputStyle: 'compressed'
          // outputStyle: 'nested'
        }).on('error', sass.logError))
        .pipe(cleanCSS())
        .on('error', error)
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest('public/css'))
      )
    })

    return stream.isEmpty() ? null : stream
  }
}
