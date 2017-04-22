// Imports
const gulp = require('gulp')
const fs = require('fs')
const del = require('del')
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

gulp.task(require('./gulp-tasks/bundleJs.js')({
  common: [
    'resources/js/analytics.js',
    'resources/js/menu.js',
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
gulp.task('cleanCss', function (done) {
  return del([
    'public/css'
  ])
})

gulp.task(require('./gulp-tasks/bundleCss.js')({
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
gulp.task('html', require('./gulp-tasks/html.js')(
  [
    'resources/templates/*.dust',
    'resources/templates/**/*.dust',
    '!resources/templates/partials/*.dust'
  ],
  {
    'portfolioItems': JSON.parse(fs.readFileSync('resources/templates/data/portfolio.json'))
  }
))

// watch html
gulp.task('watch-html', function () {
  gulp.watch([
    'resources/templates/*',
    'resources/templates/partials/*',
    'resources/templates/portfolio/*'
  ], gulp.series(
      'html',
      'service-worker',
      'refresh'
    )
  )
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
/* ------------------------------
 * live reload server
 */
const gulpRefresh = require('gulp-refresh')
gulp.task('serve', require('./gulp-tasks/serve.js').serve(gulpRefresh))
/* ------------------------------
 * refresh server
 */
gulp.task('refresh', require('./gulp-tasks/serve.js').refresh(gulpRefresh))
// js
gulp.task('js', gulp.series(
    'clean-js',
    'bundleJs',
    'revJs',
    'html',
    'serviceWorker'
  )
)
// watch js
gulp.task('watchJs', function () {
  gulp.watch([
    'resources/js/*'
  ], gulp.series('bundleJs', 'revJs', 'html', 'serviceWorker', 'refresh'))
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
  ], gulp.series('bundleCss', 'revCss', 'html', 'serviceWorker', 'refresh'))
})

/* ------------------------------
 * default task
 */
gulp.task('default', gulp.series(
  gulp.parallel('bundleJs', 'bundleCss'),
  gulp.parallel('revJs', 'revCss'),
  'html',
  'serviceWorker',
  gulp.parallel('watchJs', 'watchCss')
))
