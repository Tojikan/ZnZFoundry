'use strict';
var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass')(require('node-sass'));
const fs = require('fs');
const path = require('path');
var through = require('through2');


// gulp.task('styles', function () {
//    return gulp.src('./styles/style.scss')
//     .pipe(sass().on('error', sass.logError))
//     .pipe(gulp.dest('./styles/'));
// });

gulp.task('templates', function(){
  var files = [];
  var partials = {};

  let result = gulp.src('./templates/**/*.html')
    .pipe(through.obj(function (file, enc, cb) {
        let baseName = path.basename(file.relative, '.html');

        // if (path.basename(file.relative, '.html').startsWith('_')) {
        //   baseName = baseName.substring(1);
        // }
        partials[baseName] = file.path;

        cb(null);
    }))
    .on ('end', function () {

      const fixPaths = (filePath) => {
        const parts = filePath.split('systems');
        const relativePath = 'systems' + parts[1];;
        const normalizedPath = relativePath.replace(/\\/g, '/');
        return normalizedPath;
      }

      for (const key in partials) {
        partials[key] = fixPaths(partials[key]);
      }

      const fileOutputString = 
`
  /** Built through gulp process, don't add manually **/
  export const files = ${JSON.stringify(partials)};
`;

      fs.writeFileSync('module/_files.js', fileOutputString);
    });
    return result;
});



gulp.task('styles', function () {
  return gulp.src(['./**/*.scss', '!./node_modules/**', './templates/**/*.scss'])
   .pipe(sass().on('error', sass.logError))
   .pipe(concat('style.css'))
   .pipe(gulp.dest('./styles/'));
});

// Task to watch for changes in .scss files
gulp.task('watch', function () {
    gulp.watch('./**/*.scss', gulp.series('styles'));
    gulp.watch('./**/*.html', gulp.series('templates'));
});
  
  // Default task
gulp.task('default', gulp.series('styles', 'templates', 'watch'));