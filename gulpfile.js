// Imports
var gulp = require('gulp');
var fs = require('fs');
var rename = require('gulp-rename');
var rev = require('gulp-rev');
var del = require('del');
var postcss = require('gulp-postcss');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var svgmin = require('gulp-svgmin');
var svgstore = require('gulp-svgstore');
var cheerio = require('gulp-cheerio');
var notify = require('gulp-notify');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('run-sequence');
var size = size = require('gulp-size');
var mustache = require("gulp-mustache");
var filenames = require("gulp-filenames");
var tap = require("gulp-tap");
/* ------------------------------
 *
 * POST CSS
 *
 */
 gulp.task('clean-css', function(done){
     return del([
         'public/build/css/app.css',
         'public/build/css/app.css.map',
         'public/build/css/app-*.css'
     ]);
 });

gulp.task('build-css', function(){
    return gulp.src([
            // npm resources
            'node_modules/minireset.css/minireset.css',
            'node_modules/open-color/open-color.css',
            // includes
            'resources/css/includes/*.css',
            // main files
            'resources/css/*.css',
            'resources/css/pages/*.css'
        ])
        .pipe(sourcemaps.init())
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(concat('app.css'))
        .pipe(size({
            'title':'app.css before:',
            'pretty':true,
        }))
        .pipe(postcss([
            require("postcss-import")(),
            require("postcss-url")(),
            require('postcss-will-change'),
            require("cssnano")({
                autoprefixer: false,
                discardComments: {
                    removeAll: true
                },
                zindex: false
            }),
            require("postcss-cssnext")({
                browsers: ['last 2 versions']
            }),
            require("postcss-color-function"),
            require("postcss-reporter")({
                plugins: [
                    "postcss-color-function"
                ]
            }),
        ]))
        .pipe(size({
            'title':'app.css after:',
            'pretty':true,
        }))
        .pipe(size({
            'title':'app.css gzip:',
            'pretty':true,
            'gzip':true
        }))
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest('public/build/css'));
});
// css
gulp.task('css', function(done){
    runSequence(
        'clean-css',
        'build-css',
        'rev',
        'html',
        done
    );
});
// watch css
gulp.task('watch-css', function(){
    gulp.watch([
        'resources/css/*',
        'resources/css/**/*'
    ], ['css']);
});
/* ------------------------------
 *
 * HTML
 *
 */
gulp.task('html', function () {
    // needed to collect files for injection
    var files = {
        'css': [],
        'js': []
    };
    try{
        var json = JSON.parse(fs.readFileSync('./resources/templates/data/portfolio.json'));
    }catch(e){
        console.log(e);
        var json = {};
    }

    // get files
    return gulp.src([
        'public/build/css/*-*.css',
        'public/build/js/*-*.js'
    ], {read: false})
    .pipe(tap(function(file, t) {
        filename = file.path.split("/").slice(-1).join();
        var f = filename.split('.');
        var name = f[0].split('-').shift();
        files[f[1]][name] = filename;
    }))
    .on('end', function(){
        json.appcss = '<link rel="stylesheet" href="/build/css/'+files.css.app+'">';
        json.appjs = '<script type="text/javascript" defer src="/build/js/'+files.js.javascript+'"></script>';

        gulp.src(['resources/templates/*.mustache','resources/templates/**/*.mustache','!resources/templates/partials/*.mustache'])
            .pipe(mustache(json, {
                extension: '.html'
            }))
            .on('error', console.log)
            .pipe(gulp.dest('public'));
    });
});
// watch css
gulp.task('watch-html', function(){
    gulp.watch([
        'resources/templates/*',
        'resources/templates/**/*',
    ], ['html']);
});
/* ------------------------------
 *
 * Revision
 *
 */
gulp.task('rev', function(done){
    return gulp.src([
        'public/build/css/app.css'//,
        // 'public/build/js/app.js',
        // 'public/build/svgs/svg-sprite.svg'
    ], {base: 'public/build'})
        .pipe(rev())
        .pipe(gulp.dest('public/build'))
        .pipe(rev.manifest({
			merge: true // merge with the existing manifest (if one exists)
		}))
        .pipe(gulp.dest('public/build'));
});
/* ------------------------------
 *
 * accessibility
 *
 */
// gulp.task('checklinks', function(cb) {
//   Crawler.crawl('http://example.com/')
//     .on('fetch404', function(queueItem, response) {
//       gutil.log('Resource not found linked from ' +
//                       queueItem.referrer + ' to', queueItem.url);
//       gutil.log('Status code: ' + response.statusCode);
//     })
//     .on('complete', function(queueItem) {
//       cb();
//     });
// });
/* ------------------------------
 *
 * default task
 *
 */
gulp.task('default', function(done){
    runSequence(
[
    // 'clean-js',
    'clean-css'//,
    // 'clean-svg'
],
[
    // 'build-js',
    'build-css'//,
    // 'svgsprite'
],
    'rev',
    'html',
[
    // 'watch-svg',
    'watch-css',
    // 'watch-js',
    'watch-html'
],
    done
    );
});
