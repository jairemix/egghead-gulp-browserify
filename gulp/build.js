'use strict';

const chalk = require('chalk');
const es = require('event-stream');
const path = require('path');
const exorcist = require('exorcist'); // for extracting sourcemaps from stream

// browserify and plugins
const browserify = require('browserify'); // bundler to allow the use commonjs/ES6 imports in browser code
const tsify = require('tsify');
// const babelify = require('babelify'); // browserify wrapper for babel

// gulp and plugins
const gulp = require('gulp');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
// const gutil = require('gulp-util');
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

/**
* TODO Temporary fix to be replaced by browserify-shim
* TODO add source maps
*/
function buildGlobalScripts () {
  console.log(chalk.green('Concatenating Global Scripts'));
  return gulp.src(PATHS.global)
    .pipe(debug())
    .pipe(concat('globals.js'))
    .pipe(gulp.dest(PATHS.dist));
}

/**
* @arg bundler        bundler or watcher
* @arg applyPlugins   boolean (plugins should be applied only once!)
*/
function buildScripts (bundler, applyPlugins) {
  console.log(chalk.green('Bundling Scripts'));
  if (applyPlugins) {
    bundler.plugin(tsify, {
      target: 'es5' // also possible to use tsify with babelify if es6 is specified here
    });
  }
  return bundler
    // .transform(babelify, {
    //   presets: ['es2015'], // also specified in .babelrc
    //   extensions: ['js', '.ts'] // still in ts format
    // })
    .bundle()
    .on('error', (e) => {
      console.log(chalk.red('bundle error', e));
      // gutil.log(e);
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

function buildAssets () {
  return gulp.src(PATHS.assets)
    .pipe(gulp.dest(PATHS.dist));
}

// TODO how to return inner stream??
function run () {
  console.log(chalk.blue('Running Build'));
  return gulp.src(PATHS.dist, { read: false })
    .pipe(clean())
    .on('end', () => {
      let globalStrm = buildGlobalScripts();
      let scriptStrm = buildScripts(browserify(PATHS.entry, { debug: true }), true);
      let htmlStrm = buildTemplates();
      let styleStrm = buildStyles();
      let assetStrm = buildAssets();
      return es.merge(globalStrm, scriptStrm, htmlStrm, styleStrm, assetStrm);
    });
}

module.exports.buildTemplates = buildTemplates;
module.exports.buildGlobalScripts = buildGlobalScripts;
module.exports.buildScripts = buildScripts;
module.exports.buildStyles = buildStyles;
module.exports.buildAssets = buildAssets;
module.exports.run = run;
