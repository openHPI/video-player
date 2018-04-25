const css = require('css');
const gulp = require('gulp');
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');
const modifyFile = require('gulp-modify-file')
const styleModule = require('gulp-style-modules');

const faRootPath = './node_modules/font-awesome/';
const faStylesheet = faRootPath + 'css/font-awesome.css';
const faFonts = faRootPath + 'fonts/*';

gulp.task('clean', () => {
  return gulp.src('./dist')
             .pipe(clean());
});

gulp.task('font-face', () => {
  gulp.src(faStylesheet)
      .pipe(modifyFile((content, path, file) => {
            // Extract font-face rules
            let cssObj = css.parse(content);
            cssObj.stylesheet.rules = cssObj.stylesheet.rules.filter(x => x.type === 'font-face');
            let fontFaceRules = css.stringify(cssObj);

            // Rewrite urls
            fontFaceRules = fontFaceRules.replace(/url\(\'..\/fonts\//g, 'url(\'fonts/');

            // Embed in custom-style
            return `<custom-style>\n<style is='custom-style'>\n${fontFaceRules}\n</style>\n</custom-style>`;
        }))
      .pipe(rename('font-face.html'))
      .pipe(gulp.dest('./dist'));
});

gulp.task('style-module', () => {
  gulp.src(faStylesheet)
      .pipe(modifyFile((content, path, file) => {
            // Remove font-face rules
            let cssObj = css.parse(content);
            cssObj.stylesheet.rules = cssObj.stylesheet.rules.filter(x => x.type !== 'font-face');
            return css.stringify(cssObj);
        }))
      .pipe(styleModule({
          filename: 'font-awesome',
          moduleId: 'font-awesome'
      }))
      .pipe(gulp.dest('./dist'));
});

gulp.task('copy-fonts', () => {
  gulp.src(faFonts)
      .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('default', ['clean'], (callback) => runSequence('font-face', 'style-module', 'copy-fonts', callback));
