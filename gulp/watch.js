'use strict';

const chalk = require('chalk');
const es = require('event-stream');
const browserSync = require('browser-sync').create(); // for serving and livereloading

// browserify and plugins
const browserify = require('browserify'); // bundler to allow the use commonjs/ES6 imports in browser code
const watchify = require('watchify'); // better than gulp.watch for commonjs modules

// gulp and plugins
const gulp = require('gulp');
const gutil = require('gulp-util');

// task dependencies
const build = require('./build');

const PATHS = gulp.PATHS;

function watchTemplates () {
  // watch html files
  gulp.watch(PATHS.html)
    .on('change', () => build.buildTemplates());
  return build.buildTemplates();
}

function watchScripts () {
  // watch source files
  watchify.args.debug = true;
  const watcher = watchify(browserify(PATHS.entry, watchify.args));
  watcher.on('update', () => build.buildScripts(watcher));
  watcher.on('log', gutil.log);
  return build.buildScripts(watcher);
}

function watchStyles () {
  gulp.watch(PATHS.scss)
    .on('change', () => build.buildStyles());
  return build.buildStyles();
}

/**
* TODO investigate browserSync watchOptions (as opposed to gulp.watch)
*/
function serve () {
  console.log(chalk.green('Serving'));
  browserSync.init({
    server: {
      baseDir: PATHS.dist
    },
    port: 8080,
    logFileChanges: false
  });

  // hook in browsersync to the watch
  gulp.watch(`${PATHS.dist}/**/*.*`)
    .on('change', () => browserSync.reload());
}

function run () {
  console.log(chalk.blue('Running Watch'));
  let scriptStrm = watchScripts();
  let htmlStrm = watchTemplates();
  let styleStrm = watchStyles();
  // serve after all streams finish (after first build)
  return es.merge(scriptStrm, htmlStrm, styleStrm)
    .on('end', () => serve())
    .on('error', (error) => console.log(chalk.red('Error watching:', error)));
}

module.exports.run = run;
