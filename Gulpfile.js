const gulp = require('gulp');
const concat = require('gulp-concat');

gulp.task('polyfills', () => {
  gulp.src(['./node_modules/url-polyfill/url-polyfill.min.js', './node_modules/babel-polyfill/dist/polyfill.min.js'])
      .pipe(concat('polyfills-ie11.js'))
      .pipe(gulp.dest('./build/es5/'));
});
