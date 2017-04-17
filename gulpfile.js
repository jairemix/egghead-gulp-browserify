'use strict';

const gulp = require('gulp');
const browserify = require('browserify'); // bundler to allow the use commonjs/ES6 imports in browser code
const es = require('event-stream');

const PATHS = gulp.PATHS = {
  entry: './app/scripts/app.js',
  dest: './www',
  html: ['./app/**/*.html'],
  root: __dirname
};

// task dependencies
const build = require('./gulp/build');
const watch = require('./gulp/watch');

/**
* Compiles HTML and JS in ./app to ./www folder. Then serves the contents of ./www
* Both the contents of ./app and ./www are watched
*/
gulp.task('watch', () => {
  let scriptStrm = watch.watchScripts();
  let htmlStrm = watch.watchTemplates();
  // serve after two streams finish (after first build)
  return es.merge(scriptStrm, htmlStrm)
    .on('end', () => watch.serve())
    .on('error', (error) => console.log(chalk.red('Error watching:', error)));
});

/**
* Compiles HTML and JS to ./www folder
*/
gulp.task('build', () => {
  let scriptStrm = build.buildScripts(browserify(PATHS.entry));
  let htmlStrm = build.buildTemplates();
  return es.merge(scriptStrm, htmlStrm);
});

/**
* Alternative using Task Dependencies
*/
// gulp.task('build-scripts', () => build.buildScripts(browserify(PATHS.entry)) );
// gulp.task('build-templates', () => build.buildTemplates());
// gulp.task('build', ['templates', 'scripts']);
