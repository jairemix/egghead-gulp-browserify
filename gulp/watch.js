const chalk = require('chalk');
const browserSync = require('browser-sync').create(); // for serving and livereloading

// browserify and plugins
const browserify = require('browserify'); // bundler to allow the use commonjs/ES6 imports in browser code
const watchify = require('watchify'); // better than gulp.watch for commonjs modules

// gulp and plugins
const gulp = require('gulp');
const gutil = require('gulp-util');

// task dependencies
const building = require('./build');

const PATHS = gulp.PATHS;

function watchTemplates () {
  // watch html files
  gulp.watch(PATHS.html)
    .on('change', () => building.buildTemplates());
  return building.buildTemplates();
}

function watchScripts () {
  // watch source files
  watchify.args.debug = true;
  const watcher = watchify(browserify(PATHS.entry, watchify.args));
  watcher.on('update', () => building.buildScripts(watcher));
  watcher.on('log', gutil.log);
  return building.buildScripts(watcher);
}

function watchStyles () {
  gulp.watch(PATHS.scss)
    .on('change', () => building.buildStyles());
  return building.buildStyles();
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

module.exports.serve = serve;
module.exports.watchTemplates = watchTemplates;
module.exports.watchScripts = watchScripts;
module.exports.watchStyles = watchStyles;