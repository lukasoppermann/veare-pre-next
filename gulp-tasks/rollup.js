module.exports = function (bundles, filesToMove) {
  const gulp = require('gulp')
  const rollup = require('rollup-stream')
  const source = require('vinyl-source-stream')
  const sourcemaps = require('gulp-sourcemaps')
  const error = require('./errorHandling.js')()
  const changed = require('gulp-changed')
  const typescript = require('rollup-plugin-typescript')
  const nodeResolve = require('rollup-plugin-node-resolve')
  const streamify = require('gulp-streamify')
  const uglifyes = require('uglify-es')
  const composer = require('gulp-uglify/composer')
  const uglify = composer(uglifyes, console)

  return function bundleJs () {
    let stream = require('merge-stream')()
    bundles.forEach(function (bundle) {
      let fileName = bundle.replace(/^.*[\\/]/, '').slice(0, -3)

      stream.add(
        rollup({
          input: bundle,
          sourcemap: true,
          format: 'iife',
          plugins: [
            typescript({
              typescript: require('typescript'), // use local version
              // outDir: 'public/js',
              rootDir: './',
              module: 'es6',
              target: 'es6',
              declaration: false,
              removeComments: true,
              lib: [
                'dom',
                'es6'
              ]
            })
          ]
        })
        .on('error', error)
        // rename
        .pipe(source(fileName + '.js'))
        .pipe(streamify(uglify()))
        .pipe(streamify(sourcemaps.init({loadMaps: true})))
        .pipe(streamify(sourcemaps.write('/')))
        .pipe(gulp.dest('public/js'))
        .pipe(gulp.src(filesToMove, {passthrough: true}))
        .pipe(changed('public/js'))
        .pipe(gulp.dest('public/js'))
      )
    })
    return stream
  }
}
