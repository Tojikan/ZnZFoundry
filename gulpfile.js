'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass')(require('node-sass'));


gulp.task('styles', function () {
   return gulp.src('./styles/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./styles/'));
});

// Task to watch for changes in .scss files
gulp.task('watch', function () {
    gulp.watch('styles/**/*.scss', gulp.series('styles'));
});
  
  // Default task
gulp.task('default', gulp.series('styles', 'watch'));