// Imports
var gulp = require('gulp');
var rename = require('gulp-rename');
var rev = require('gulp-rev');
var del = require('del');
var prefix = require('gulp-autoprefixer');
var less = require('gulp-less');
var concat = require('gulp-concat');
var submitSitemap  = require('submit-sitemap').submitSitemap;

// actions
gulp.task('clean-build', function(done){
    del(['public/build']).then(function(){
        done();
    });
});

gulp.task('build-css', ['clean-build'], function(){
    return gulp.src(['resources/less/*'])
    .pipe(less())
    .pipe(concat('app.css'))
    .pipe(prefix({
        browsers: ['last 4 versions', 'IE 9', 'IE 8'],
        cascade: false
    }))
    // needs to minimize
    .pipe(gulp.dest('public/build/css'));
});

gulp.task('build-js', ['clean-build'], function(){
    return gulp.src(['resources/js/*.js'])
    // .pipe() // needs to minimize
    .pipe(concat('app.js'))
    .pipe(gulp.dest('public/build/js'));
});

gulp.task('rev', ['build-js', 'build-css'], function(){
    return gulp.src(['public/build/css/app.css', 'public/build/js/app.js'], {base: 'public/build'})
    .pipe(rev())
    .pipe(gulp.dest('public/build'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('public/build'));
});

gulp.task('clean-build-step', ['rev'], function(){
    return del(['public/build/css/app.css', 'public/build/js/app.js']);
});

// sitemap
gulp.task('sitemap', function(done){
    console.log('sitemap task not implemented');
    // var yourSitemapUrl = "http://www.vea.re/sitemap.xml";
    // submitSitemap(yourSitemapUrl);
});

// gulp watch
gulp.task('rev-watch', function(){
    gulp.watch(['public/css/*.css','public/js/*.js'], ['rev']);
});
gulp.task('css-watch', function(){
    gulp.watch(['public/css/*.css'], ['build-css']);
});

// gulp tasks
gulp.task('default', ['clean-build','build-css', 'build-js', 'rev', 'clean-build-step']);
