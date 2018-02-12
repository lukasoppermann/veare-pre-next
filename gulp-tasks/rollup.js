module.exports = function (dir, filesToMove) {
  const gulp = require('gulp')
  const rollup = require('rollup-stream')
  const source = require('vinyl-source-stream')
  const sourcemaps = require('gulp-sourcemaps')
  const glob = require('glob')
  const path = require('path')
  const changed = require('gulp-changed')
  const typescript = require('rollup-plugin-typescript')
  const nodeResolve = require('rollup-plugin-node-resolve')
  const error = require('./errorHandling.js')()
  const streamify = require('gulp-streamify')
  const uglifyes = require('uglify-es')
  const composer = require('gulp-uglify/composer')
  const uglify = composer(uglifyes, console)
  const merge = require('merge-stream')

  return bundleJs = function() {
    return merge(glob.sync(dir + '/*.ts').map(function (entry) {
      return rollup({
        input: entry,
        sourcemap: true,
        format: 'iife',
        name: entry.replace(/^.*[\\/]/, '').slice(0, -3),
        plugins: [
          typescript({
            typescript: require('typescript'), // use local version
            rootDir: './',
            module: 'es6',
            target: 'es6',
            allowJs: true,
            declaration: false,
            removeComments: true,
            lib: [
              'dom',
              'es6'
            ]
          }),
          nodeResolve({
            module: true,
            jsnext: true,
            browser: true,
            extensions: [ '.js', '.json' ],
            preferBuiltins: false
          })
        ]
      })
      .on('error', error)
      .pipe(source(path.resolve(entry.slice(0, -3) + '.js'), path.resolve(dir)))
      .pipe(streamify(uglify()))
      .pipe(streamify(sourcemaps.init({loadMaps: true})))
      .pipe(streamify(sourcemaps.write('/', {
        sourceMappingURL: file => '/' + file.relative + '.map'
      })))
    }))
    .pipe(gulp.dest('public/js'))
    .pipe(gulp.src(filesToMove, {passthrough: true}))
    .pipe(changed('public/js'))
    .pipe(gulp.dest('public/js'))
  }
}
