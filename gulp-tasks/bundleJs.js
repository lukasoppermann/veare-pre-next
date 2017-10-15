module.exports = function (bundles, filesToMove) {
  const gulp = require('gulp')
  const sourcemaps = require('gulp-sourcemaps')
  const babel = require('gulp-babel')
  const concat = require('gulp-concat')
  const uglify = require('gulp-uglify')
  const error = require('./errorHandling.js')()
  const changed = require('gulp-changed')

  return function bundleJs () {
    let stream = require('merge-stream')()

    Object.keys(bundles).forEach(function (key) {
      let savings = require('./savingsReporter')()

      stream.add(gulp.src(bundles[key])
        .pipe(sourcemaps.init())
        .pipe(babel({
          presets: [ [ 'es2015', { modules: false } ] ],
          plugins: ['transform-custom-element-classes']
        }))
        .on('error', error)
        .pipe(concat(key + '.js'))
        .pipe(savings.start())
        .pipe(uglify())
        .pipe(savings.stop())
        .pipe(savings.gziped())
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.src(filesToMove, {passthrough: true}))
        .pipe(changed('public/js'))
        .pipe(gulp.dest('public/js'))
        .on('end', () => savings.report('JS (' + key + '):'))
      )
    })
    return stream
  }
}
