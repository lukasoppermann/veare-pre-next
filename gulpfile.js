// Imports
const gulp = require('gulp')
const fs = require('fs')
const browserSync = require('browser-sync')
/* ------------------------------
 *
 * JS
 *
 */
gulp.task('bundleJs', require('./gulp-tasks/rollup.js')('resources/js/',
  // files to only be moved to js folder
  [
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-sd-ce.js',
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-sd-ce.js.map',
    'node_modules/fetch-inject/dist/fetch-inject.min.js'
  ]
))
/* ------------------------------
 *
 * POST CSS
 *
 */

gulp.task('bundleCss', require('./gulp-tasks/bundleCss.js')({
  'app': [
    // includes
    'resources/css/includes/*.css',
    // main files
    'resources/css/*.css',
    'resources/css/pages/*.css'
  ]
}, [
  'public/*.html',
  'public/portfolio/*.html',
  'public/blog/*.html'
]))
/* ------------------------------
 *
 * SVG
 *
 */
// gulp.task('svg', () => {
//   gulp.src(['resources/svgs/*'])
//     .pipe(gulp.dest('public/svgs'))
// })
//
/* ------------------------------
 *
 * imagemin
 *
 */
const imagemin = require('gulp-imagemin')
gulp.task('images', () =>
  gulp.src('resources/media/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest('public/media'))
)
/* ------------------------------
 *
 * Revision
 *
 */
gulp.task('revCss', require('./gulp-tasks/rev.js')('css', ['public/css/app.css']))
gulp.task('revJs', require('./gulp-tasks/rev.js')('js',
  [
    'public/js/webcomponents.js',
    'public/js/registerServiceWorker.js',
    'public/js/blog.js',
    'public/js/setConfig.js',
    'public/js/rest.js'
  ]))
/* ------------------------------
 *
 * service-worker
 *
 */
gulp.task('serviceWorker', require('./gulp-tasks/serviceWorker.js')(
  {
    rootDir: 'public',
    files: [
      'media/lukas-oppermann@2x.png'
    ],
    revisionedFiles: () => {
      if (fs.existsSync('public/rev-manifest.json')) {
        return JSON.parse(fs.readFileSync('public/rev-manifest.json', 'utf8'))
      }
    }
  })
)
// watch js
gulp.task('watchJs', function () {
  gulp.watch([
    'resources/js/*',
    'resources/js/**/*'
  ], gulp.series('bundleJs', 'revJs', function reload (cb) {
    browserSync.reload()
    cb()
  }))
})
/* ------------------------------
 *
 * watch task
 *
 */
gulp.task('watchCss', function () {
  gulp.watch([
    'resources/css/*',
    'resources/css/**/*'
  ], gulp.series('bundleCss', 'revCss', function reload (cb) {
    browserSync.reload()
    cb()
  }))
})
/* ------------------------------
 *
 * watch task
 *
 */
gulp.task('watchTemplates', function () {
  gulp.watch([
    'resources/templates/*',
    'resources/templates/**/*'
  ], gulp.series(function reload (cb) {
    browserSync.reload()
    cb()
  }))
})
/* ------------------------------
 * default task
 */
gulp.task('browser-sync', function (cb) {
  browserSync({
    proxy: 'localhost:8080',  // local node app address
    port: 5000,  // use *different* port than above
    notify: true,
    open: false
  }, cb)
})

gulp.task('serve', require('./gulp-tasks/serve.js').serve())

gulp.task('default', gulp.series(
  'browser-sync',
  gulp.parallel('bundleJs', 'bundleCss'),
  'revJs',
  'revCss',
  gulp.parallel('watchJs', 'watchCss', 'watchTemplates')
))

/* ------------------------------
 * build task
 */
gulp.task('build', gulp.series(
  function standard (cb) {
    let standard = require('standard')
    let linter = require('gulp-standard-bundle').linter
    return gulp.src('resources/js/*.js')
    .pipe(linter(standard))
    .pipe(linter.reporter('default', {
      breakOnError: false
    }))
  },
  gulp.parallel('bundleJs', 'bundleCss', 'images'),
  gulp.parallel('revJs', 'revCss'),
  'serviceWorker'
))
