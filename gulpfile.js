// Imports
const gulp = require('gulp')
const fs = require('fs')
// var rename = require('gulp-rename')
const rev = require('gulp-rev')
const del = require('del')
const postcss = require('gulp-postcss')
const concat = require('gulp-concat')
// var uglify = require('gulp-uglify')
const plumber = require('gulp-plumber')
// var svgmin = require('gulp-svgmin')
// var svgstore = require('gulp-svgstore')
// var cheerio = require('gulp-cheerio')
const notify = require('gulp-notify')
const sourcemaps = require('gulp-sourcemaps')
const runSequence = require('run-sequence')
const size = require('gulp-size')
const mustache = require('gulp-mustache')
// var filenames = require('gulp-filenames')
const tap = require('gulp-tap')
const path = require('path')
const babel = require('gulp-babel')
const gulpif = require('gulp-if')
/* ------------------------------
 *
 * JS
 *
 */
gulp.task('clean-js', function () {
  return del([
    'public/build/js'
  ])
})

gulp.task('build-js', function (done) {
  let files = {
    common: [
      'resources/js/analytics.js',
      'resources/js/app.js',
      'node_modules/page-sections/dist/page-sections.js',
      'node_modules/page-sections/dist/page-section.js'
    ],
    portfolio: [
      'node_modules/minigrid/dist/minigrid.min.js',
      'resources/js/cards.js'
    ],
    webcomponents: [
      'node_modules/webcomponents.js/webcomponents-loader.js'
      // 'node_modules/@webcomponents/template/template.js',
      // 'node_modules/@webcomponents/custom-elements/custom-elements.min.js',
      // 'node_modules/@webcomponents/shadydom/shadydom.min.js',
      // 'node_modules/@webcomponents/shadycss/scoping-shim.js',
      // 'node_modules/@webcomponents/shadycss/apply-shim.js',
      // 'node_modules/@webcomponents/shadycss/custom-style-interface.js'
    ]
  }
  let moveFiles = [
    'node_modules/webcomponents.js/webcomponents-hi-sd-ce.js'
  ]
  // MOVE files
  gulp.src(moveFiles)
    .pipe(gulp.dest('public/build/js'))
  // BUILD JS
  Object.keys(files).forEach(function (key) {
    gulp.src(files[key])
        .pipe(size({
          'title': key + '.js before:',
          'pretty': true
        }))
        .pipe(sourcemaps.init())
        .pipe(gulpif('/.babel$/b', babel({
          presets: ['es2015'],
          plugins: ['transform-custom-element-classes']
        })))
        .pipe(concat(key + '.js'))
        // .pipe(uglify())
        .pipe(size({
          'title': key + '.js after:',
          'pretty': true
        }))
        .pipe(size({
          'title': key + '.js gzip:',
          'pretty': true,
          'gzip': true
        }))
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest('public/build/js'))
  })
  done()
})
// js
gulp.task('js', function (done) {
  runSequence(
        'clean-js',
        'build-js',
        'rev',
        'html',
        done
    )
})
// watch js
gulp.task('watch-js', function () {
  gulp.watch([
    'resources/js/*'
  ], ['js'])
})
/* ------------------------------
 *
 * POST CSS
 *
 */
gulp.task('clean-css', function (done) {
  return del([
    'public/build/css/app.css',
    'public/build/css/app.css.map',
    'public/build/css/app-*.css'
  ])
})

gulp.task('build-css', function () {
  return gulp.src([
    // npm resources
    'node_modules/minireset.css/minireset.css',
    'node_modules/open-color/open-color.css',
    'node_modules/flex-layout-attribute/css/flex-layout-attribute.css',
    'node_modules/modular-scale-css/modular-scale.css',
    // includes
    'resources/css/includes/*.css',
    // main files
    'resources/css/*.css',
    'resources/css/pages/*.css'
  ])
        .pipe(sourcemaps.init())
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(concat('app.css'))
        .pipe(size({
          'title': 'app.css before:',
          'pretty': true
        }))
        .pipe(postcss([
          require('postcss-import')(),
          require('postcss-will-change'),
          require('postcss-discard-comments'),
          require('cssnano')({
            // autoprefixer: false,
            discardComments: {
              removeAll: true
            }
            // zindex: false
          }),
          require('postcss-cssnext')({
            browsers: ['last 2 versions']
          }),
          require('postcss-color-function'),
          require('postcss-reporter')({
            plugins: [
              'postcss-color-function'
            ]
          })
        ]))
        .pipe(size({
          'title': 'app.css after:',
          'pretty': true
        }))
        .pipe(size({
          'title': 'app.css gzip:',
          'pretty': true,
          'gzip': true
        }))
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest('public/build/css'))
})
// css
gulp.task('css', function (done) {
  runSequence(
        'clean-css',
        'build-css',
        'rev',
        'html',
        done
    )
})
// watch css
gulp.task('watch-css', function () {
  gulp.watch([
    'resources/css/*',
    'resources/css/**/*'
  ], ['css'])
})
/* ------------------------------
 *
 * HTML
 *
 */
gulp.task('html', function () {
  let json = JSON.parse(fs.readFileSync('./resources/templates/data/portfolio.json'))
  json.css = {}
  json.js = {}
    // get files
  return gulp.src([
    'public/build/css/*-*.css',
    'public/build/js/*-*.js'
  ], {read: false})
    .pipe(tap(function (file) {
      let filename = path.basename(file.path)
      let [name, ext] = filename.split('.')
      json[ext][name.split('-').shift()] = '/build/' + ext + '/' + filename
    }))
    .on('end', function () {
      gulp.src(['resources/templates/*.mustache', 'resources/templates/**/*.mustache', '!resources/templates/partials/*.mustache'])
        .pipe(mustache(json, {
          extension: '.html'
        }))
        .on('error', console.log)
        .pipe(gulp.dest('public'))
    })
})
// watch css
gulp.task('watch-html', function () {
  gulp.watch([
    'resources/templates/*',
    'resources/templates/**/*'
  ], ['html'])
})
/* ------------------------------
 *
 * Revision
 *
 */
gulp.task('rev', function (done) {
    // delete old files in a snycronus manor
  var manifest = fs.readFileSync('public/build/rev-manifest.json', 'utf8')
  del.sync(Object.values(JSON.parse(manifest)), {'cwd': 'public/build/'})

  return gulp.src([
    'public/build/css/app.css',
    'public/build/js/*.js'
        // 'public/build/svgs/svg-sprite.svg'
  ], {base: 'public/build'})
        .pipe(rev())
        .pipe(gulp.dest('public/build'))
        .pipe(rev.manifest({
          merge: true // merge with the existing manifest (if one exists)
        }))
        .pipe(gulp.dest('public/build'))
})
/* ------------------------------
 *
 * default task
 *
 */
gulp.task('default', function (done) {
  runSequence(
    [
      'clean-js',
      'clean-css'
    // 'clean-svg'
    ],
    [
      'build-js',
      'build-css'
    // 'svgsprite'
    ],
    'rev',
    'html',
    [
    // 'watch-svg',
      'watch-css',
      'watch-js',
      'watch-html'
    ],
    done
    )
})
