'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const browserify = require('browserify'); // bundler to allow the use commonjs/ES6 imports in browser code
const debug = require('gulp-debug');
const watchify = require('watchify'); // better than gulp.watch for commonjs modules
const babelify = require('babelify'); // babel plugin for browserify
const exorcist = require('exorcist'); // for extracting sourcemaps from browserify
const source = require('vinyl-source-stream'); // for converting a browserify stream into a gulp stream
const browserSync = require('browser-sync').create(); // for serving and livereloading
const chalk = require('chalk');
const es = require('event-stream');
const path = require('path');

const PATHS = gulp.PATHS = {
  entry: './app/scripts/app.js',
  html: ['./app/**/*.html'],
  dest: './www'
};

function bundleScripts (bundler) {
  console.log(chalk.green('Bundling Scripts'));
  return bundler
    .transform(babelify.configure({
      presets: ['es2015']
    }))
    .bundle()
    .on('error', (e) => {
      gutil.log(e);
    })
    .pipe(exorcist(path.join(__dirname, `${PATHS.dest}/app.js.map`)))
    .pipe(source('app.js'))
    .pipe(gulp.dest('./www'));
}

function copyTemplates() {
  console.log(chalk.green('Copying Templates'));
  return gulp.src(PATHS.html)
    .pipe(debug())
    .pipe(gulp.dest('./www'));
}

/**
* TODO investigate browserSync watchOptions (as opposed to gulp.watch)
*/
function serve () {
  console.log(chalk.green('Serving'));
  browserSync.init({
    server: {
      baseDir: PATHS.dest
    },
    port: 8080,
    logFileChanges: false
  });

  // hook in browsersync to the watch
  gulp.watch(`${PATHS.dest}/**/*.*`)
    .on('change', () => browserSync.reload());
}

gulp.task('scripts', () => {
  return bundleScripts(browserify(PATHS.entry));
});

/**
* Need to make sure that bundleScripts() and copyTemplates() finish before serve() runs
* Three solutions:
* 1. Wrap bundleScripts and copyTemplates into two respective tasks and make watch depend on them
* 2. Listen for stream.on('end', () => {}) and stream.on('error', (error) => {}) events
* 3. Merge two event streams using event-stream
*/
gulp.task('watch', () => {
  // watch source files
  watchify.args.debug = true;
  const watcher = watchify(browserify(PATHS.entry, watchify.args));
  let scriptStrm = bundleScripts(watcher);
  watcher.on('update', () => bundleScripts(watcher));
  watcher.on('log', gutil.log);

  // watch html files
  let htmlStrm = copyTemplates();
  gulp.watch(PATHS.html)
    .on('change', () => copyTemplates());

  // serve on first build
  return es.merge(scriptStrm, htmlStrm)
    .on('end', () => serve())
    .on('error', (error) => console.log(chalk.red('Error watching:', error)));
});

gulp.task('templates', () => copyTemplates());
gulp.task('build', ['templates', 'scripts']);
