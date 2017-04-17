'use strict';

const gulp = require('gulp');
const browserify = require('browserify'); // bundler to allow the use commonjs/ES6 imports in browser code
const es = require('event-stream');

const PATHS = gulp.PATHS = {
  entry: './app/scripts/app.js', // script entry
  dist: './www',
  html: ['./app/**/*.html'],
  scss: './app/styles.scss', // scss entry
  root: __dirname
};

/**
* Compiles HTML, JS and SCSS in ./app to ./www folder. Then serves the contents of ./www
* Both the contents of ./app and ./www are watched
*/
gulp.task('watch', () => {
  const watch = require('./gulp/watch');
  let scriptStrm = watch.watchScripts();
  let htmlStrm = watch.watchTemplates();
  let styleStrm = watch.watchStyles();
  // serve after all streams finish (after first build)
  return es.merge(scriptStrm, htmlStrm, styleStrm)
    .on('end', () => watch.serve())
    .on('error', (error) => console.log(chalk.red('Error watching:', error)));
});

/**
* Compiles HTML, JS and SCSS in ./app to ./www folder
*/
gulp.task('build', () => {
  const build = require('./gulp/build');
  let scriptStrm = build.buildScripts(browserify(PATHS.entry, { debug: true }));
  let htmlStrm = build.buildTemplates();
  let styleStrm = build.buildStyles();
  return es.merge(scriptStrm, htmlStrm, styleStrm);
});

/**
* Alternative using Task Dependencies
*/
// gulp.task('build-scripts', () => build.buildScripts(browserify(PATHS.entry)) );
// gulp.task('build-templates', () => build.buildTemplates());
// gulp.task('build', ['templates', 'scripts']);
