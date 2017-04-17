const chalk = require('chalk');
const path = require('path');
const exorcist = require('exorcist'); // for extracting sourcemaps from stream

// browserify and plugins
const babelify = require('babelify'); // browserify wrapper for babel

// gulp and plugins
const gulp = require('gulp');
const source = require('vinyl-source-stream'); // for converting browserify stream to gulp stream
const debug = require('gulp-debug'); // debugging: shows file in gulp stream

const PATHS = gulp.PATHS;

function buildTemplates () {
  console.log(chalk.green('Copying Templates'));
  return gulp.src(PATHS.html)
    .pipe(debug())
    .pipe(gulp.dest(PATHS.dest));
}

function buildScripts (bundler) {
  console.log(chalk.green('Bundling Scripts'));
  return bundler
    .transform(babelify.configure({
      presets: ['es2015']
    }))
    .bundle()
    .on('error', (e) => {
      gutil.log(e);
    })
    .pipe(exorcist(path.join(PATHS.root, `${PATHS.dest}/app.js.map`)))
    .pipe(source('app.js'))
    .pipe(debug())
    .pipe(gulp.dest(PATHS.dest));
}

module.exports.buildTemplates = buildTemplates;
module.exports.buildScripts = buildScripts;
