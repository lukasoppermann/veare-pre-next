module.exports = function (bundles) {
  const gulp = require('gulp')
  const sourcemaps = require('gulp-sourcemaps')
  const postcss = require('gulp-postcss')
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
        .pipe(postcss([
          require('postcss-will-change'),
          require('postcss-discard-comments'),
          // require('postcss-cssnext')({
          //   browsers: ['last 2 versions'],
          //   features: {
          //     rem: false,
          //     customProperties: {
          //       preserve: true
          //     }
          //   }
          // }),
          require('postcss-round-subpixels'),
          // require('postcss-uncss')({
          //   html: ['public/*.html', 'public/portfolio/*.html'],
          //   ignore: [/.is-(.*)/]
          // }),
          require('cssnano')({
            autoprefixer: false,
            discardComments: {
              removeAll: true
            }
          }),
          require('postcss-reporter')({
            plugins: [
              'postcss-color-function'
            ]
          })
        ]))
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
