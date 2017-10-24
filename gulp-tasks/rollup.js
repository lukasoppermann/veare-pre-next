module.exports = function (bundles, filesToMove) {
  const gulp = require('gulp')
  const rollup = require('rollup-stream')
  const source = require('vinyl-source-stream')
  const sourcemaps = require('gulp-sourcemaps')
  const uglify = require('gulp-uglify')
  const ts = require('gulp-typescript')
  const error = require('./errorHandling.js')()
  const changed = require('gulp-changed')
  const typescript = require('rollup-plugin-typescript')
  const nodeResolve = require('rollup-plugin-node-resolve')

  return function bundleJs () {
    let stream = require('merge-stream')()
    bundles.forEach(function (bundle) {
      let savings = require('./savingsReporter')()
      let fileName = bundle.replace(/^.*[\\\/]/, '')

      let tsResult = gulp.src(bundle)
        .pipe(ts({
          noImplicitAny: true,
          // outFile: fileName.slice(0, -3) + '.js',
          rootDir: './',
          module: 'es6',
          target: 'es6',
          declaration: false,
          removeComments: true,
          lib: [
            'dom',
            'es6'
          ]
        }))
        .pipe(sourcemaps.init())
        .on('error', error)

      stream.add(
        tsResult
        // rename
        // .pipe(source(fileName))
        .pipe(savings.start())
        // .pipe(uglify())
        .pipe(savings.stop())
        .pipe(savings.gziped())
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.src(filesToMove, {passthrough: true}))
        .pipe(changed('public/js'))
        .pipe(gulp.dest('public/js'))
        .on('end', () => savings.report('JS (' + fileName + '):'))
      )
    })
    return stream
  }
}
