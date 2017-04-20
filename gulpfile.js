'use strict';

const gulp = require('gulp');

const PATHS = gulp.PATHS = {
  entry: './app/app.ts', // script entry
  global: [
    './bower_components/angular/angular.js',
    './bower_components/angular-animate/angular-animate.js',
    './bower_components/angular-sanitize/angular-sanitize.js',
    './bower_components/angular-ui-router/release/angular-ui-router.js',
    './bower_components/ionic/release/js/ionic.js',
    './bower_components/ionic/release/js/ionic-angular.js'
  ],
  dist: './www',
  html: ['./app/**/*.html'],
  scss: './app/styles.scss', // scss entry
  assets: ['app/*/images/**/*', 'app/*/fonts/**/*', 'app/*/data/**/*'],
  root: __dirname
};

/**
* Compiles HTML, TS, JS and SCSS in ./app to ./www folder.
* Then serves the contents of ./www
* Both the contents of ./app and ./www are watched
* (Global files, e.g. bower_components files are not watched)
*/
gulp.task('watch', () => require('./gulp/watch').run());

/**
* Compiles HTML, TS, JS and SCSS in ./app to ./www folder
*/
gulp.task('build', () => require('./gulp/build').run());
