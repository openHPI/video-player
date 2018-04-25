const glob = require('glob');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const insert = require('gulp-insert');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify-es').default;
const concat = require('gulp-concat');
const mergeStream = require('merge-stream');
const runSequence = require('run-sequence');
const HtmlSplitter = require('polymer-build').HtmlSplitter;
const PolymerProject = require('polymer-build').PolymerProject;
const babelPresetES2015 = require('babel-preset-es2015');
const babelPresetES2015NoModules = babelPresetES2015.buildPreset({}, {modules: false});

const ES5_FILE_PATTERNS = ['bower_components/hls.js/dist/**/*.js', 'bower_components/webcomponentsjs/**/*.js'];
const ES5_FILES = [].concat(...ES5_FILE_PATTERNS.map(pattern => glob.sync(pattern)));

const needsEs5Compilation = (file) => !ES5_FILES.includes(file.relative) && file.extname === '.js';
const bundle = (compile, dest) => {
  const htmlSplitter = new HtmlSplitter();
  const project = new PolymerProject(require('./polymer.json'));
  const version = require('./package.json').version;

  return mergeStream(project.sources(), project.dependencies())
      .pipe(htmlSplitter.split())
      .pipe(gulpif(compile ? needsEs5Compilation : false, babel({presets: [babelPresetES2015NoModules]})))
      .pipe(gulpif(/\.js$/, uglify()))
      .pipe(htmlSplitter.rejoin())
      .pipe(project.bundler())
      .pipe(gulpif(/\.html$/, htmlmin({collapseWhitespace: true, minifyCSS: true, removeComments: true})))
      .pipe(gulpif(/^video-player.html$/, insert.prepend(`<!-- video-player v${version} -->\r\n`)))
      .pipe(gulp.dest(dest));
};

const cleanDir = (dir) => gulp.src(dir, {read: false}).pipe(clean());
gulp.task('clean-es5', () => cleanDir('build/es5'));
gulp.task('clean-es6', () => cleanDir('build/es6'));
gulp.task('clean', ['clean-es5', 'clean-es6']);

gulp.task('polyfills', () => {
  gulp.src(['./node_modules/url-polyfill/url-polyfill.min.js', './node_modules/babel-polyfill/dist/polyfill.min.js'])
      .pipe(concat('polyfills-ie.js'))
      .pipe(gulp.dest('./build/es5/'));
});

gulp.task('bundle-es5', ['clean-es5'], () => bundle(true, 'build/es5'));
gulp.task('bundle-es6', ['clean-es6'], () => bundle(false, 'build/es6'));
gulp.task('bundle', ['clean'], (callback) => runSequence('bundle-es5', 'bundle-es6', 'polyfills', callback));

gulp.task('default', ['bundle']);
