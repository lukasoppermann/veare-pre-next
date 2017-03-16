// Imports
const gulp = require('gulp')
const fs = require('fs')
const chalk = require('chalk')
const gutil = require('gulp-util')
// var rename = require('gulp-rename')
const rev = require('gulp-rev')
const del = require('del')
const postcss = require('gulp-postcss')
const concat = require('gulp-concat')
// var uglify = require('gulp-uglify')
const refresh = require('gulp-refresh')
const nodemon = require('gulp-nodemon')
// var svgmin = require('gulp-svgmin')
// var svgstore = require('gulp-svgstore')
// var cheerio = require('gulp-cheerio')
const sourcemaps = require('gulp-sourcemaps')
const runSequence = require('run-sequence')
const size = require('gulp-size')
const mustache = require('gulp-mustache')
// var filenames = require('gulp-filenames')
const tap = require('gulp-tap')
const path = require('path')
const babel = require('gulp-babel')

function swallowError (error) {
  // If you want details of the error in the console
  console.log(error.toString())
  this.emit('end')
}
/* ------------------------------
 *
 * JS
 *
 */
gulp.task('clean-js', function () {
  return del([
    'public/js'
  ])
})

gulp.task('build-js', function (done) {
  let files = {
    common: [
      'resources/js/analytics.js',
      'resources/js/app.js',
      'node_modules/page-sections/dist/page-sections.js'
    ],
    portfolio: [
      'node_modules/minigrid/dist/minigrid.min.js',
      'resources/js/cards.js'
    ],
    'registerServiceWorker': [
      'resources/js/register-sw.js'
    ]
  }
  let moveFiles = [
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
  // MOVE files
  gulp.src(moveFiles)
    .pipe(gulp.dest('public/js'))
  // BUILD JS
  Object.keys(files).forEach(function (key) {
    const sizes = {
      'before': size(),
      'after': size(),
      'gzip': size()
    }
    gulp.src(files[key])
        .pipe(sizes.before)
        .pipe(sourcemaps.init())
        .pipe(babel({
          presets: ['es2015'],
          plugins: ['transform-custom-element-classes']
        }))
        .on('error', swallowError)
        .pipe(concat(key + '.js'))
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
        .pipe(gulp.dest('public/js'))
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
    'public/css'
  ])
})

gulp.task('build-css', function () {
  const sizes = {
    'before': size(),
    'after': size(),
    'gzip': size({
      gzip: true
    })
  }
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
        // .pipe(sourcemaps.init())
        .pipe(concat('app.css'))
        .pipe(sizes.before)
        .pipe(postcss([
          require('postcss-import')(),
          require('postcss-will-change'),
          require('postcss-discard-comments'),
          require('postcss-cssnext')({
            browsers: ['last 2 versions'],
            features: {
              rem: false
            }
          }),
          require('cssnano')({
            autoprefixer: false,
            discardComments: {
              removeAll: true
            }
            // zindex: false
          }),
          require('postcss-reporter')({
            plugins: [
              'postcss-color-function'
            ]
          })
        ]))
        .pipe(sizes.after)
        .pipe(sizes.gzip)
        // .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest('public/css'))
        .on('end', function () {
          let decrease = Math.floor(((sizes.before.size - sizes.after.size) / sizes.before.size * 100))
          gutil.log(chalk.white.bgGreen.bold(`${decrease}% saved`) + ` Total size ${sizes.after.prettySize} / ` + chalk.green.bold(`${sizes.gzip.prettySize} (gzip)`))
        })
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
    'public/css/*-*.css',
    'public/js/*-*.js'
  ], {read: false})
    .pipe(tap(function (file) {
      let filename = path.basename(file.path)
      let [name, ext] = filename.split('.')
      json[ext][name.split('-').shift()] = '/' + ext + '/' + filename
    }))
    .on('end', function () {
      gulp.src(['resources/templates/*.mustache', 'resources/templates/**/*.mustache', '!resources/templates/partials/*.mustache'])
        .pipe(mustache(json, {
          extension: '.html'
        }))
        .on('error', console.log)
        .pipe(gulp.dest('public'))
        .pipe(refresh())
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
  if (fs.existsSync('public/rev-manifest.json')) {
    var manifest = fs.readFileSync('public/rev-manifest.json', 'utf8')
    del.sync(Object.values(JSON.parse(manifest)), {'cwd': 'public/'})
  }

  return gulp.src([
    'public/css/app.css',
    'public/js/*.js'
        // 'public/svgs/svg-sprite.svg'
  ], {base: 'public'})
        .pipe(rev())
        .pipe(gulp.dest('public'))
        .pipe(rev.manifest({
          merge: true // merge with the existing manifest (if one exists)
        }))
        .pipe(gulp.dest('public'))
})
/* ------------------------------
 *
 * live reload
 *
 */
gulp.task('serve', function () {
  nodemon({
    script: 'server.js',
    watch: 'server.js',
    delay: '1000'
  })
  .on('start', function () {
    setTimeout(function () {
      refresh()
    }, 2000) // wait for the server to finish loading before restarting the browsers
  })
})
/* ------------------------------
 *
 * default task
 *
 */
gulp.task('default', function (done) {
  refresh.listen()
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
