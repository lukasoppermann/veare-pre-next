// Imports
const gulp = require('gulp')
const fs = require('fs')
const del = require('del')
const browserSync = require('browser-sync')
/* ------------------------------
 *
 * JS
 *
 */
gulp.task('clean-js', () => {
  return del([
    'public/js'
  ])
})

gulp.task('bundleJs', require('./gulp-tasks/bundleJs.js')({
  common: [
    'resources/js/analytics.js',
    'resources/js/menu.js',
    'resources/js/img.js',
    'resources/js/app.js'
  ],
  webcomponents: [
    'node_modules/page-sections/dist/page-sections.js'
  ],
  portfolio: [
    'node_modules/minigrid/dist/minigrid.min.js',
    'resources/js/cards.js'
  ],
  'registerServiceWorker': [
    'resources/js/register-service-worker.js'
  ]
},
  // files to only be moved to js folder
  [
    'node_modules/webcomponents.js/webcomponents-loader.js',
    'node_modules/webcomponents.js/webcomponents-hi-sd-ce.js',
    'node_modules/webcomponents.js/webcomponents-hi-ce.js',
    'node_modules/webcomponents.js/webcomponents-hi.js',
    'node_modules/webcomponents.js/webcomponents-lite.js',
    'node_modules/webcomponents.js/webcomponents-sd-ce.js',
    'node_modules/webcomponents.js/webcomponents-hi-sd-ce.js.map',
    'node_modules/webcomponents.js/webcomponents-hi-ce.js.map',
    'node_modules/webcomponents.js/webcomponents-hi.js.map',
    'node_modules/webcomponents.js/webcomponents-lite.js.map',
    'node_modules/webcomponents.js/webcomponents-sd-ce.js.map'
  ]
))
/* ------------------------------
 *
 * POST CSS
 *
 */
gulp.task('cleanCss', function (done) {
  return del([
    'public/css'
  ])
})

gulp.task('bundleCss', require('./gulp-tasks/bundleCss.js')({
  'app': [
    // npm resources
    'node_modules/minireset.css/minireset.css',
    'node_modules/flex-layout-attribute/css/flex-layout-attribute.css',
    'node_modules/modular-scale-css/modular-scale.css',
    // includes
    'resources/css/includes/*.css',
    // main files
    'resources/css/*.css',
    'resources/css/pages/*.css'
  ]
}))

/* ------------------------------
 *
 * DUST
 *
 */
const dustHtml = require('./gulp-tasks/html.js')(
  [
    'resources/templates/*.dust',
    'resources/templates/**/*.dust',
    '!resources/templates/partials/*.dust'
  ],
  {
    'portfolioItems': JSON.parse(fs.readFileSync('resources/templates/data/portfolio.json'))
  }
)
gulp.task('html', dustHtml())
gulp.task('htmlBuild', dustHtml(true))

// watch html
gulp.task('watchHtml', function () {
  gulp.watch([
    'resources/templates/*',
    'resources/templates/partials/*',
    'resources/templates/portfolio/*'
  ], gulp.series('html', function reload (cb) {
    browserSync.reload()
    cb()
  }))
})

/* ------------------------------
 *
 * SVG
 *
 */
gulp.task('svg', () => {
  gulp.src(['resources/svgs/*'])
    .pipe(gulp.dest('public/svgs'))
})
/* ------------------------------
 *
 * Revision
 *
 */
gulp.task('revCss', require('./gulp-tasks/rev.js')('css', ['public/css/app.css']))
gulp.task('revJs', require('./gulp-tasks/rev.js')('css',
  [
    'public/js/common.js',
    'public/js/portfolio.js',
    'public/js/webcomponents.js',
    'public/js/registerServiceWorker.js'
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
      'media/veare-icons@2x.png',
      'media/lukas-oppermann@2x.png',
      'css/app.css'
    ],
    revisionedFiles: JSON.parse(fs.readFileSync(`public/rev-manifest.json`, 'utf8'))
  })
)
// js
gulp.task('js', gulp.series(
    'clean-js',
    'bundleJs',
    'html'
  )
)
// watch js
gulp.task('watchJs', function () {
  gulp.watch([
    'resources/js/*'
  ], gulp.series('bundleJs', function reload (cb) {
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
  ], gulp.series('bundleCss', function reload (cb) {
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

gulp.task('default', gulp.series(
  'browser-sync',
  gulp.parallel('bundleJs', 'bundleCss'),
  'html',
  gulp.parallel('watchJs', 'watchCss', 'watchHtml')
))

gulp.task('serve', require('./gulp-tasks/serve.js').serve())

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
  gulp.parallel('bundleJs', 'bundleCss'),
  gulp.parallel('revJs', 'revCss'),
  'htmlBuild',
  'serviceWorker'
))
