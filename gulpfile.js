// Imports
const gulp = require('gulp')
const fs = require('fs')
const browserSync = require('browser-sync')
/* ------------------------------
 *
 * JS
 *
 */
gulp.task('bundleJs', require('./gulp-tasks/bundleJs.js')({
  common: [
    'resources/js/analytics.js',
    'resources/js/menu.js',
    'resources/js/img.js',
    'resources/js/app.js'
  ],
  webcomponents: [
    'node_modules/page-sections/dist/page-sections.js',
    'node_modules/responsive-image/dist/responsiveImage.js'
  ],
  portfolio: [
    'node_modules/minigrid/dist/minigrid.min.js',
    'resources/js/cards.js'
  ],
  registerServiceWorker: [
    'resources/js/register-service-worker.js'
  ],
  blog: [
    'node_modules/prismjs/prism.js',
    'node_modules/prismjs/components/prism-bash.js'
  ],
  'dev-grid': [
    'resources/js/dev-grid.js'
  ]
},
  // files to only be moved to js folder
  [
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js',
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-hi-sd-ce.js',
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-hi-ce.js',
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-hi.js',
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-lite.js',
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-sd-ce.js',
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-hi-sd-ce.js.map',
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-hi-ce.js.map',
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-hi.js.map',
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-lite.js.map',
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-sd-ce.js.map'
  ]
))
/* ------------------------------
 *
 * POST CSS
 *
 */

gulp.task('bundleCss', require('./gulp-tasks/bundleCss.js')({
  'app': [
    // npm resources
    'node_modules/minireset.css/minireset.css',
    'node_modules/modular-scale-css/modular-scale.css',
    'node_modules/raster.css/dist/raster.css',
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
gulp.task('revJs', require('./gulp-tasks/rev.js')('js',
  [
    'public/js/common.js',
    'public/js/portfolio.js',
    'public/js/webcomponents.js',
    'public/js/registerServiceWorker.js',
    'public/js/blog.js'
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
    'resources/js/*'
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
  gulp.parallel('watchJs', 'watchCss')
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
  gulp.parallel('bundleJs', 'bundleCss'),
  gulp.parallel('revJs', 'revCss'),
  'serviceWorker'
))
