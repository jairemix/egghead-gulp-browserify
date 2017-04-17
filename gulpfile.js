const gulp = require('gulp');
const gutil = require('gulp-util');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const debug = require('gulp-debug');
const watchify = require('watchify');
const browserSync = require('browser-sync').create();

const paths = gulp.paths = {
  entry: './app/scripts/app.js',
  html: ['./app/**/*.html'],
  dest: './www'
};

function bundleScripts (bundler) {
  return bundler
    .bundle()
    .on('error', (e) => {
      gutil.log(e);
    })
    .pipe(source('app.js'))
    // needed to convert the browserify stream and turn it into a gulp stream
    .pipe(gulp.dest('./www'));
}

function serve () {
  browserSync.init({
    server: {
      baseDir: paths.dest
    },
    logFileChanges: false
  });

  gulp.watch(`${paths.dest}/**/*.*`)
    .on('change', () => browserSync.reload());
}

gulp.task('scripts', () => {
  return bundleScripts(browserify(paths.entry));
});

gulp.task('watch', () => {
  const watcher = watchify(browserify(paths.entry, watchify.args));
  bundleScripts(watcher);
  watcher.on('update', () => bundleScripts(watcher));
  watcher.on('log', gutil.log);
  serve();
});

gulp.task('templates', () => {
  gulp.src(paths.html)
    .pipe(debug())
    .pipe(gulp.dest('./www'));
});

gulp.task('build', ['templates', 'scripts']);
