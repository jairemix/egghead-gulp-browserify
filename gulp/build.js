'use strict';

const chalk = require('chalk');
const es = require('event-stream');
const path = require('path');
const exorcist = require('exorcist'); // for extracting sourcemaps from stream

// browserify and plugins
const browserify = require('browserify'); // bundler to allow the use commonjs/ES6 imports in browser code
const babelify = require('babelify'); // browserify wrapper for babel

// gulp and plugins
const gulp = require('gulp');
const source = require('vinyl-source-stream'); // for converting browserify stream to gulp stream
const debug = require('gulp-debug'); // debugging: shows file in gulp stream
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

const PATHS = gulp.PATHS;

function buildTemplates () {
  console.log(chalk.green('Copying Templates'));
  return gulp.src(PATHS.html)
    // .pipe(debug())
    .pipe(gulp.dest(PATHS.dist));
}

function buildScripts (bundler) {
  console.log(chalk.green('Bundling Scripts'));
  return bundler
    .transform(babelify)
    // .transform(babelify.configure( // specified in .babelrc
    //   { presets: ['es2015'] }
    // ))
    .bundle()
    .on('error', (e) => {
      gutil.log(e);
    })
    .pipe(exorcist(path.join(PATHS.root, `${PATHS.dist}/app.js.map`)))
    .pipe(source('app.js'))
    // .pipe(debug())
    .pipe(gulp.dest(PATHS.dist));
}

function buildStyles () {
  console.log(chalk.green('Compiling Styles'));
  return gulp.src(PATHS.scss)
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer({ browsers: ['iOS 8', 'last 4 versions'], remove: false }))
    .pipe(sourcemaps.write('.')) // write in same directory as destination
    // .pipe(debug())
    .pipe(gulp.dest(PATHS.dist));
}

function run () {
  console.log(chalk.blue('Running Build'));
  let scriptStrm = buildScripts(browserify(PATHS.entry, { debug: true }));
  let htmlStrm = buildTemplates();
  let styleStrm = buildStyles();
  return es.merge(scriptStrm, htmlStrm, styleStrm);
}

module.exports.buildTemplates = buildTemplates;
module.exports.buildScripts = buildScripts;
module.exports.buildStyles = buildStyles;
module.exports.run = run;
