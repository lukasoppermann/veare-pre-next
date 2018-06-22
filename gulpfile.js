// Imports
const gulp = require('gulp')
const fs = require('fs')
/* ------------------------------
 *
 * JS
 *
 */
// gulp.task('bundleJs', require('./gulp-tasks/rollup.js')('resources/js/'))
gulp.task('bundleJs', require('./gulp-tasks/roll.js')('resources/js/*.ts'))
gulp.task('moveJs', require('./gulp-tasks/moveFiles.js')([
  'node_modules/@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce.js',
  'node_modules/@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce.js.map',
  'node_modules/fetch-inject/dist/fetch-inject.min.js'
], 'public/js'))
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
}))
/* ------------------------------
 *
 * Revision
 *
 */
gulp.task('revCss', require('./gulp-tasks/rev.js')('css', ['public/css/app.css']))
// js
gulp.task('revJs', require('./gulp-tasks/rev.js')('js',
  fs.readdirSync('resources/js/').filter(file => {
    return file.substr(-3) === '.ts'
  }).map(item => {
    return `public/js/${item.replace(/\.ts$/, '.js')}`
  })
))
/* ------------------------------
 *
 * images
 *
 */
gulp.task('revMedia', require('./gulp-tasks/rev.js')('media',
  fs.readdirSync('public/media/').filter(file => {
    return file.substr(-4) === '.png' || file.substr(-4) === '.jpg' || file.substr(-4) === '.svg'
  }).map(item => {
    return `public/media/${item}`
  })
))

gulp.task('copyMedia', () => gulp.src('resources/media/*.*')
  .pipe(gulp.dest('public/media'))
)

gulp.task('images', gulp.series(
  'copyMedia',
  'revMedia'
))
/* ------------------------------
 *
 * service-worker
 *
 */
gulp.task('pwaManifest', require('./gulp-tasks/pwaManifest.js')(JSON.parse(fs.readFileSync('public/rev-manifest.json', 'utf8'))))
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
    // browserSync.reload()
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
    // browserSync.reload()
    cb()
  }))
})
/* ------------------------------
 *
 * watch task
 *
 */
// gulp.task('watchTemplates', function () {
//   gulp.watch([
//     'resources/templates/*',
//     'resources/templates/**/*'
//   ], gulp.series(function reload (cb) {
//     browserSync.reload()
//     cb()
//   }))
// })
/* ------------------------------
 * default task
 */
// gulp.task('browser-sync', function (cb) {
//   browserSync({
//     proxy: 'localhost:8080',  // local node app address
//     port: 5000,  // use *different* port than above
//     notify: true,
//     open: false
//   }, cb)
// })

gulp.task('serve', require('./gulp-tasks/serve.js').serve())

gulp.task('default', gulp.series(
  // 'browser-sync',
  gulp.parallel('moveJs', 'bundleJs', 'bundleCss'),
  'revJs',
  'revCss',
  'pwaManifest',
  gulp.parallel('watchJs', 'watchCss',
  // 'watchTemplates'
  )
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
  gulp.parallel(gulp.series(
    gulp.parallel('moveJs', 'bundleJs', 'bundleCss'),
    gulp.parallel('revJs', 'revCss')
    ),
    'images'
  ),
  gulp.parallel('pwaManifest') // , 'serviceWorker'
))
