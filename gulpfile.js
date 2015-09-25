// Imports
var gulp = require('gulp');
var rename = require('gulp-rename');
var rev = require('gulp-rev');
var del = require('del');
var prefix = require('gulp-autoprefixer');
var less = require('gulp-less');

// actions
gulp.task('clean-buid', function(done){
    del(['public/build']).then(function(){
        done();
    });
});

gulp.task('build-css', function(){
    return gulp.src(['resources/less/*.less'])
    .pipe(less())
    .pipe(prefix({
        browsers: ['last 4 versions', 'IE 9', 'IE 8'],
        cascade: false
    }))
    .pipe(gulp.dest('public/css/'));
});

gulp.task('rev', ['clean-buid'], function(){
    return gulp.src(['public/css/*.css', 'public/js/*.js'], {base: 'public'})
    .pipe(rev())
    .pipe(gulp.dest('public/build'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('public/build'));
});
// gulp watch
gulp.task('rev-watch', function(){
    gulp.watch(['public/css/*.css','public/js/*.js'], ['rev']);
});
gulp.task('css-watch', function(){
    gulp.watch(['public/css/*.css'], ['build-css']);
});

// gulp tasks
gulp.task('default', ['build-css', 'css-watch','rev', 'rev-watch']);
