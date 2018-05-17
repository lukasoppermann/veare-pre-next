module.exports = function (bundles) {
  const gulp = require('gulp')
  const sourcemaps = require('gulp-sourcemaps')
  const cleanCSS = require('gulp-clean-css')
  const concat = require('gulp-concat')
  const error = require('./errorHandling.js')()

  return function bundleCss () {
    let stream = require('merge-stream')()
    Object.keys(bundles).forEach(function (key) {
      let savings = require('./savingsReporter')()
      stream.add(gulp.src(bundles[key])
        .pipe(sourcemaps.init())
        .pipe(concat(key + '.css'))
        .pipe(savings.start())
        .pipe(cleanCSS())
        .on('error', error)
        .pipe(savings.stop())
        .pipe(savings.gziped())
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest('public/css'))
        .on('end', () => savings.report('CSS (' + key + '):'))
      )
    })

    return stream.isEmpty() ? null : stream
  }
}
