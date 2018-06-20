module.exports = function (entry) {
  const gulp = require('gulp')
  const typescript = require('rollup-plugin-typescript')
  const nodeResolve = require('rollup-plugin-node-resolve')
  const rollupEach = require('gulp-rollup-each')
  const rename = require('gulp-rename')
  const sourcemaps = require('gulp-sourcemaps')
  const uglifyes = require('uglify-es')
  const composer = require('gulp-uglify/composer')
  const uglify = composer(uglifyes, console)

  return function bundleJs () {
    return gulp.src(entry)
      // .pipe(sourcemaps.init())
      .pipe(rollupEach({
        output: {
          format: 'iife'
        },
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
      }))
      .pipe(uglify())
      .pipe(rename({
        extname: '.js'
      }))
      // .pipe(sourcemaps.write('', {sourceMappingURLPrefix: '/'})) // '' to save map as seperate file in same folder
      .pipe(gulp.dest('public/js'))
  }
}
