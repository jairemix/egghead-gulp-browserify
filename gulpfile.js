const gulp = require('gulp');
const gutil = require('gulp-util');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const debug = require('gulp-debug');
// needed to convert the browserify stream and turn it into a gulp stream

const paths = gulp.paths = {
  scriptEntry: ['./app/scripts/app.js'],
  html: ['./app/**/*.html']
}

gulp.task('scripts', () => {
  browserify('./app/scripts/app.js')
    .bundle()
    .on('error', (e) => {
      gutil.log(e);
    })
    .pipe(source('app.js'))
    .pipe(gulp.dest('./www'));
});

gulp.task('templates', () => {
  gulp.src(paths.html)
    .pipe(debug())
    .pipe(gulp.dest('./www'));
});

gulp.task('build', ['templates', 'scripts']);
