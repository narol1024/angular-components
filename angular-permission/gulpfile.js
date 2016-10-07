var gulp = require('gulp');
var uglifyjs = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var jsFolder = ['./src/js/*.js'];
gulp.task('uglifyjs', function() {
    return gulp.src(jsFolder)
        .pipe(gulp.dest('./dist/js/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglifyjs())
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('connect', function() {
    connect.server({
        root: '../',
        port: 9999,
        host: 'localhost'
    });
});

gulp.task('start', function() {
    gulp.watch(jsFolder, ['uglifyjs']);
    gulp.start('uglifyjs');
    gulp.start('connect');
});
gulp.task('default', ['start']);