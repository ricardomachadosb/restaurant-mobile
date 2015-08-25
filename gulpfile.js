var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var inject = require('gulp-inject');
var series = require('stream-series');
var jade = require('gulp-jade');
var runSequence = require('run-sequence');

var paths = {
  sass: ['./scss/**/*.scss'],
  jade: ['./jade/**/*.jade'],
  javascript: [
    './www/**/*.js',
    '!./www/js/app.js',
    '!./www/lib/**',
    '!./www/js/*/default.js'
  ],
  css: [
    './www/**/*.css',
    '!./www/css/ionic.app*.css',
    '!./www/lib/**'
  ],
  defaults: [
    './www/js/services/default.js',
    './www/js/controllers/default.js'
  ]
};

gulp.task('default', ['build']);

gulp.task('build', function () {
  runSequence(['sass', 'jade', 'index']);
});

gulp.task('index', function () {
  return gulp.src('./www/index.html')
    .pipe(inject(
      series(
        gulp.src(paths.defaults, {read: false}),
        gulp.src(paths.javascript, {read: false})), {relative: true}))
    .pipe(inject(gulp.src(paths.css, {read: false}), {relative: true}))
    .pipe(gulp.dest('./www'));
});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('jade', function (done) {
  gulp.src(paths.jade)
    .pipe(jade())
    .pipe(gulp.dest('./www/templates/'))
    .on('end', done);
});

gulp.task('watch', function () {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.jade, ['jade']);
  gulp.watch([
    paths.javascript,
    paths.css
  ], ['index']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
