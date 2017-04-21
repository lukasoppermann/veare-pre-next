// Imports
const gulp = require('gulp')
const fs = require('fs')
const chalk = require('chalk')
const gutil = require('gulp-util')
const checkPages = require('check-pages')
const rev = require('gulp-rev')
const revdel = require('gulp-rev-delete-original')
const del = require('del')
const postcss = require('gulp-postcss')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const refresh = require('gulp-refresh')
const nodemon = require('gulp-nodemon')
// var svgmin = require('gulp-svgmin')
// var svgstore = require('gulp-svgstore')
// var cheerio = require('gulp-cheerio')
const sourcemaps = require('gulp-sourcemaps')
const runSequence = require('run-sequence')
const size = require('gulp-size')
const dust = require('gulp-dust-html')
const babel = require('gulp-babel')

function swallowError (error) {
  // If you want details of the error in the console
  console.log(error.toString())
  this.emit('end')
}

function reportSavings (sizes, prefix) {
  let decrease = Math.floor(((sizes.before.size - sizes.after.size) / sizes.before.size * 100))
  gutil.log(prefix + ' ' + chalk.white.bgGreen.bold(` ${decrease}% saved `) + ` Total size ${sizes.after.prettySize} / ` + chalk.green.bold(`${sizes.gzip.prettySize} (gzip)`))
}

let filesJS = {
  common: [
    'resources/js/analytics.js',
    'resources/js/menu.js',
    'resources/js/app.js',
    'node_modules/page-sections/dist/page-sections.js'
  ],
  portfolio: [
    'node_modules/minigrid/dist/minigrid.min.js',
    'resources/js/cards.js'
  ],
  'registerServiceWorker': [
    'resources/js/register-service-worker.js'
  ]
}
let moveFilesJS = [
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
  // MOVE files
  gulp.src(moveFilesJS)
    .pipe(gulp.dest('public/js'))

  Object.keys(filesJS).forEach(function (key) {
    const sizes = {
      'before': size({showTotal: false}),
      'after': size({showTotal: false}),
      'gzip': size({
        showTotal: false,
        gzip: true
      })
    }

    gulp.src(filesJS[key])
        .pipe(sourcemaps.init())
        .pipe(babel({
          presets: [ [ 'es2015', { modules: false } ] ],
          plugins: ['transform-custom-element-classes']
        }))
        .on('error', swallowError)
        .pipe(concat(key + '.js'))
        .pipe(sizes.before)
        .pipe(uglify())
        .pipe(sizes.after)
        .pipe(sizes.gzip)
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest('public/js'))
        .on('end', function () {
          reportSavings(sizes, 'JS (' + key + '):')
        })
  })

  done()
})

gulp.task('rev-js', function () {
  let revFiles = Object.keys(filesJS)
  revFiles = revFiles.map((file) => `public/js/${file}.js`)

  return gulp.src(revFiles, {base: 'public'})
    .pipe(rev())
    .pipe(gulp.dest('public'))
    .pipe(revdel())
    .pipe(rev.manifest('rev-manifest.json', {
      cwd: 'public',
      merge: true
    }))
    .pipe(gulp.dest('public'))
})
// js
gulp.task('js', function (done) {
  runSequence(
        'clean-js',
        'build-js',
        'rev-js',
        'html',
        'service-worker',
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
    'before': size({showTotal: false}),
    'after': size({showTotal: false}),
    'gzip': size({
      gzip: true,
      showTotal: false
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
    .pipe(sourcemaps.init())
    .pipe(concat('app.css'))
    .pipe(sizes.before)
    .pipe(postcss([
      require('postcss-will-change'),
      require('postcss-discard-comments'),
      // require('postcss-cssnext')({
      //   browsers: ['last 2 versions'],
      //   features: {
      //     rem: false,
      //     customProperties: {
      //       preserve: true
      //     }
      //   }
      // }),
      require('postcss-round-subpixels'),
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
    .on('error', swallowError)
    .pipe(sizes.after)
    .pipe(sizes.gzip)
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest('public/css'))
    .on('end', function () {
      reportSavings(sizes, 'CSS:')
    })
})
// css
gulp.task('css', function (done) {
  runSequence(
        'clean-css',
        'build-css',
        'rev',
        'html',
        'service-worker',
        done
    )
})
// watch css
gulp.task('watch-css', function () {
  gulp.watch([
    'resources/css/*',
    'resources/css/**/*'
  ], ['default'])
})
/* ------------------------------
 *
 * DUST
 *
 */
gulp.task('html', function () {
  // load portfolio data
  let data = {
    'portfolioItems': JSON.parse(fs.readFileSync('resources/templates/data/portfolio.json'))
  }
  // preapre files
  const files = JSON.parse(fs.readFileSync('public/rev-manifest.json', 'utf8'))
  Object.keys(files).map(function (key, index) {
    data[key.replace('.', '_').replace(/^[a-z]+\//, '')] = files[key]
  })

  return gulp.src(['resources/templates/*.dust', 'resources/templates/**/*.dust', '!resources/templates/partials/*.dust'])
      .pipe(dust({
        basePath: 'resources/templates',
        whitespace: true,
        data: data
      }))
      .on('error', swallowError)
      .pipe(gulp.dest('public'))
      .pipe(refresh())
})
// watch css
gulp.task('watch-html', function () {
  gulp.watch([
    'resources/templates/*',
    'resources/templates/partials/*',
    'resources/templates/portfolio/*'
  ], ['html'])
})
/* ------------------------------
 *
 * Revision
 *
 */
gulp.task('rev', function (done) {
  // synchronously delete old files
  // if (fs.existsSync('public/rev-manifest.json')) {
  //   var manifest = fs.readFileSync('public/rev-manifest.json', 'utf8')
  //   del.sync(Object.values(JSON.parse(manifest)), {'cwd': 'public/'})
  // }

  return gulp.src([
    'public/css/app.css'
      // 'public/js/*.js'
      // 'public/svgs/svg-sprite.svg'
  ], {base: 'public'})
    .pipe(rev())
    .pipe(gulp.dest('public'))
    .pipe(revdel())
    .pipe(rev.manifest('rev-manifest.json', {
      cwd: 'public',
      merge: true
    }))
    .pipe(gulp.dest('public'))
})
/* ------------------------------
 *
 * service-worker
 *
 */
gulp.task('service-worker', function (done) {
  const swPrecache = require('sw-precache')
  const rootDir = 'public'
  // urls to prefetch
  let urlsToPrefetch = [
    'media/veare-icons@2x.png',
    'media/lukas-oppermann@2x.png',
    'css/app.css'
  ]
  // get revisioned file version if exists in manifest
  const fileHashes = JSON.parse(fs.readFileSync(`${rootDir}/rev-manifest.json`, 'utf8'))
  // replace url with revisioned url in urlsToPrefetch
  urlsToPrefetch = urlsToPrefetch.map(function (item) {
    // replace item with revisioned item
    if (typeof fileHashes[item] !== 'undefined') {
      return `${rootDir}/${fileHashes[item]}`
    }
    // return item if no revision is available
    return `${rootDir}/${item}`
  })
  // create service worker
  swPrecache.write(`${rootDir}/service-worker.js`, {
    staticFileGlobs: urlsToPrefetch,
    stripPrefix: rootDir,
    runtimeCaching: [{
      urlPattern: '/(.*)',
      handler: 'cacheFirst'
    }, {
      urlPattern: /\.googleapis\.com\//,
      handler: 'cacheFirst'
    }]
  }, done)
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
 * check links
 *
 */
gulp.task('checkLinks', function (callback) {
  var options = {
    pageUrls: [
      'http://localhost:8080/',
      'http://localhost:8080/blog',
      'http://localhost:8080/portfolio'
    ],
    checkLinks: true,
    noEmptyFragments: true,
    noLocalLinks: true,
    noRedirects: true,
    onlySameDomain: true,
    preferSecure: true,
    queryHashes: true,
    checkCaching: true,
    checkCompression: true,
    checkXhtml: true,
    summary: true,
    terse: true,
    maxResponseTime: 200,
    userAgent: 'custom-user-agent/1.2.3'
  }
  checkPages(console, options, callback)
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
    'rev-js',
    'rev',
    'html',
    'service-worker',
    [
    // 'watch-svg',
      'watch-css',
      'watch-js',
      'watch-html'
    ],
    done
    )
})
