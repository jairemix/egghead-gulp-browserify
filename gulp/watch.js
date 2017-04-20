'use strict';

const chalk = require('chalk');
const es = require('event-stream');
const browserSync = require('browser-sync').create(); // for serving and livereloading

// browserify and plugins
const browserify = require('browserify'); // bundler to allow the use commonjs/ES6 imports in browser code
const watchify = require('watchify'); // better than gulp.watch for commonjs modules

// gulp and plugins
const gulp = require('gulp');
const flatmap = require('gulp-flatmap');
const clean = require('gulp-clean');
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
  const bundler = browserify(PATHS.entry, watchify.args);
  const watcher = watchify(bundler);
  watcher.on('update', (updated) => {
    console.log(chalk.blue(updated));
    build.buildScripts(watcher, false);
  });
  watcher.on('log', gutil.log);
  return build.buildScripts(watcher, true);
}

function watchStyles () {
  gulp.watch(PATHS.scss)
    .on('change', () => build.buildStyles());
  return build.buildStyles();
}

function watchAssets () {
  gulp.watch(PATHS.assets)
    .on('change', () => build.buildAssets());
  return build.buildAssets();
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

  // livereload
  gulp.watch([`${PATHS.dist}/**/*.*`, `!${PATHS.dist}/**/*.css`, `!${PATHS.dist}/**/*.css.map`]) // all but css and css sourcemaps
    .on('change', (evt) => browserSync.reload());
  gulp.watch([`${PATHS.dist}/**/*.css`]) // `${PATHS.dist}/**/*.css.map` // cannot reload when sourcemaps are regenerated, otherwise reloads
    .on('change', (evt) => {
      // console.log('css changed: injecting', evt.path);
      gulp.src(evt.path).pipe(browserSync.stream());
    });
}

// TODO how to return inner stream ??
function run () {
  console.log(chalk.blue('Running Watch'));
  // return gulp.src(PATHS.dist, { read: false })
  //   .pipe(clean())
  //   .on('end', () => {
  //     let globalStrm = build.buildGlobalScripts(); // not watched
  //     let scriptStrm = watchScripts();
  //     let htmlStrm = watchTemplates();
  //     let styleStrm = watchStyles();
  //     let assetStrm = watchAssets();
  //     // serve after all streams finish (after first build)
  //     return es.merge(globalStrm, scriptStrm, htmlStrm, styleStrm, assetStrm)
  //       .on('end', () => serve())
  //       .on('error', (error) => console.log(chalk.red('Error watching:', error)));
  //   });
  return gulp.src(PATHS.dist, { read: false })
    .pipe(clean())
    .pipe(flatmap((stream, file) => {
      console.log(chalk.magenta('Finished cleaning'));
      let globalStrm = build.buildGlobalScripts(); // not watched
      let scriptStrm = watchScripts();
      let htmlStrm = watchTemplates();
      let styleStrm = watchStyles();
      let assetStrm = watchAssets();
      // serve after all streams finish (after first build)
      return es.merge(globalStrm, scriptStrm, htmlStrm, styleStrm, assetStrm);
    }))
    .on('end', () => serve());
}

module.exports.run = run;
