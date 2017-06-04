module.exports = function (bundles, links) {
  const gulp = require('gulp')
  const sourcemaps = require('gulp-sourcemaps')
  const cssnano = require('gulp-cssnano')
  const concat = require('gulp-concat')
  const error = require('./errorHandling.js')()
  const uncss = require('gulp-uncss')

  return function bundleCss () {
    let stream = require('merge-stream')()
    Object.keys(bundles).forEach(function (key) {
      let savings = require('./savingsReporter')()
      stream.add(gulp.src(bundles[key])
        .pipe(sourcemaps.init())
        .pipe(concat(key + '.css'))
        .pipe(savings.start())
        .pipe(cssnano({
          autoprefixer: false,
          discardComments: {
            removeAll: true
          }
        }))
        .on('error', error)
        // .pipe(uncss({
        //   html: links,
        //   ignore: [/is-(.*)/]
        // }))
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
