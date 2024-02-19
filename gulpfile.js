'use strict';
var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass')(require('node-sass'));


gulp.task('styles', function () {
   return gulp.src('./styles/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./styles/'));
});


gulp.task('styles-all', function () {
  return gulp.src('**/*.scss')
   .pipe(sass().on('error', sass.logError))
   .pipe(concat('all.scss'))
   .pipe(gulp.dest('./styles/'));
});

// Task to watch for changes in .scss files
gulp.task('watch', function () {
    gulp.watch('styles/**/*.scss', gulp.series('styles', 'styles-all'));
});
  
  // Default task
gulp.task('default', gulp.series('styles', 'watch'));