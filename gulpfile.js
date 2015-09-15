// Imports
var gulp = require('gulp');
var rename = require('gulp-rename');
var rev = require('gulp-rev');

// actions
gulp.task('rev', function(){
    return gulp.src(['public/css/*.css', 'public/js/*.js'], {base: 'public'})
    .pipe(gulp.dest('public/build'))
    .pipe(rev())
    .pipe(gulp.dest('public/build'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('public/build'));
});

// gulp tasks
gulp.task('default', ['rev']);
