const gulp = require('gulp');
const gutil = require('gulp-util');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const debug = require('gulp-debug');
const watchify = require('watchify');

// needed to convert the browserify stream and turn it into a gulp stream

const paths = gulp.paths = {
  entry: './app/scripts/app.js',
  html: ['./app/**/*.html']
}

function bundleScripts (bundler) {
  return bundler
    .bundle()
    .on('error', (e) => {
      gutil.log(e);
    })
    .pipe(source('app.js'))
    .pipe(gulp.dest('./www'));
}

gulp.task('scripts', () => {
  return bundleScripts(browserify(paths.entry));
});

gulp.task('watch', () => {
  const watcher = watchify(browserify(paths.entry, watchify.args));
  bundleScripts(watcher);
  watcher.on('update', () => bundleScripts(watcher));
  watcher.on('log', gutil.log);
});

gulp.task('templates', () => {
  gulp.src(paths.html)
    .pipe(debug())
    .pipe(gulp.dest('./www'));
});

gulp.task('build', ['templates', 'scripts']);
