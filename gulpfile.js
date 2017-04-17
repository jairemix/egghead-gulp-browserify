'use strict';

const gulp = require('gulp');

const PATHS = gulp.PATHS = {
  entry: './app/scripts/app.ts', // script entry
  dist: './www',
  html: ['./app/**/*.html'],
  scss: './app/styles.scss', // scss entry
  root: __dirname
};

/**
* Compiles HTML, JS and SCSS in ./app to ./www folder. Then serves the contents of ./www
* Both the contents of ./app and ./www are watched
*/
gulp.task('watch', () => require('./gulp/watch').run());

/**
* Compiles HTML, JS and SCSS in ./app to ./www folder
*/
gulp.task('build', () => require('./gulp/build').run());
