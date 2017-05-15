const path = require('path');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const ignore = require('gulp-ignore');
const runSequence = require('run-sequence');
const mergeStream = require('merge-stream');
const Bundler = require('polymer-build').Bundler;
const HtmlSplitter = require('polymer-build').HtmlSplitter;
const PolymerProject = require('polymer-build').PolymerProject;

const babelPresetES2015 = require('babel-preset-es2015');
const babelPresetES2015NoModules = babelPresetES2015.buildPreset({}, {modules: false});


const cleanDir = (dir) => gulp.src(dir, {read: false}).pipe(clean());
gulp.task('clean-tmp', () => cleanDir('.tmp'));
gulp.task('clean-es5', () => cleanDir('dist/es5'));
gulp.task('clean-es6', () => cleanDir('dist/es6'));
gulp.task('clean-dist', () => cleanDir('dist'));
gulp.task('clean', ['clean-tmp', 'clean-dist']);

gulp.task('prepare-transpile', ['clean-tmp'], () => {
  const project = new PolymerProject(require('./polymer.json'));

  return mergeStream(gulp.src('./polymer.json'), project.sources(), project.dependencies())
    .pipe(gulp.dest('.tmp'));
});
gulp.task('transpile-es5', ['prepare-transpile'], () => {
  const polymerHtmlSplitter = new HtmlSplitter();
  let polymer = gulp.src('.tmp/bower_components/polymer/**/*', { base: '.tmp' })
    .pipe(polymerHtmlSplitter.split())
		.pipe(gulpif( /\.js$/, babel({
      presets: [babelPresetES2015NoModules]
    })))
		.pipe(polymerHtmlSplitter.rejoin());

  const componentHtmlSplitter = new HtmlSplitter();
  const project = new PolymerProject(require('./.tmp/polymer.json'));
  let component = mergeStream(project.sources(), project.dependencies())
    .pipe(ignore.exclude('bower_components/webcomponentsjs/**/*'))
    .pipe(ignore.exclude('bower_components/polymer/**/*'))
    .pipe(componentHtmlSplitter.split())
		.pipe(gulpif( /\.js$/, babel({
      presets: [babelPresetES2015]
    })))
		.pipe(componentHtmlSplitter.rejoin());

  return mergeStream(polymer, component)
    .pipe(gulp.dest('.tmp'));
});

const bundle = (baseDir, outputDir) => {
  let cwd = process.cwd();
  process.chdir(baseDir); // Change working directory so that project file paths are correct
  const project = new PolymerProject(require('./polymer.json'));

  return mergeStream(project.sources(), project.dependencies())
    .pipe(project.bundler())
    .pipe(gulp.dest(path.join(cwd, outputDir)))
    .on('end', () => {
      process.chdir(cwd); // Reset working directory after pipeline was executed
      gulp.start('clean-tmp');
    });
};
gulp.task('bundle-es5', ['clean-es5', 'transpile-es5'], () => bundle('.tmp', 'dist/es5'));
gulp.task('bundle-es6', ['clean-es6'], () => bundle('.', 'dist/es6'));
gulp.task('bundle', ['clean'], (callback) => runSequence('bundle-es5', 'bundle-es6', callback));

gulp.task('default', ['bundle']);
