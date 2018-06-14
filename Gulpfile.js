const fs = require('fs');
const glob = require('glob');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const insert = require('gulp-insert');
const uglify = require('gulp-uglify-es').default;
const concat = require('gulp-concat');
const mergeStream = require('merge-stream');
const PolymerProject = require('polymer-build').PolymerProject;
const babelPresetES2015 = require('babel-preset-es2015');
const babelPresetES2015NoModules = babelPresetES2015.buildPreset({}, {modules: false});

const WEB_COMPONENTS_POLYFILLS = [
  './node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js',
  './node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js',
];
const IE_POLYFILLS = [
  './node_modules/url-polyfill/url-polyfill.min.js',
  './node_modules/babel-polyfill/dist/polyfill.min.js',
];
const ES5_FILE_PATTERNS = ['node_modules/hls.js/**/*.js'];
const ES5_FILES = [].concat(...ES5_FILE_PATTERNS.map(pattern => glob.sync(pattern)));

const bundle = (compile, dest) => {
  // Bundle main sources and dependencies
  const project = new PolymerProject(JSON.parse(fs.readFileSync('./polymer.json', 'utf8')));
  const version = JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
  let bundleStream = mergeStream(project.sources(), project.dependencies());
  if(compile) {
    bundleStream = bundleStream
      .pipe(gulpif((file) => !ES5_FILES.includes(file.relative), babel({presets: [babelPresetES2015NoModules]})));
  }
  bundleStream = bundleStream
    .pipe(uglify())
    .pipe(project.bundler({inlineScripts: false}))
    .pipe(insert.prepend(`/* video-player v${version} */\r\n`));

  // Copy polyfills to output
  let polyfillsStream = gulp.src(WEB_COMPONENTS_POLYFILLS);
  if(compile) {
    polyfillsStream = mergeStream(
      polyfillsStream,
      gulp.src(IE_POLYFILLS)
        .pipe(concat('polyfills-ie.js'))
    );
  }

  return mergeStream(bundleStream, polyfillsStream)
    .pipe(gulp.dest(dest));
};

const cleanDir = (dir) => gulp.src(dir, {read: false, allowEmpty: true}).pipe(clean());
gulp.task('clean-es5', () => cleanDir('build/es5'));
gulp.task('clean-es6', () => cleanDir('build/es6'));
gulp.task('clean', gulp.parallel('clean-es5', 'clean-es6'));

gulp.task('bundle-es5', () => bundle(true, 'build/es5'));
gulp.task('bundle-es6', () => bundle(false, 'build/es6'));
gulp.task('bundle', gulp.series('clean', gulp.parallel('bundle-es5', 'bundle-es6')));

gulp.task('default', gulp.series('bundle'));
