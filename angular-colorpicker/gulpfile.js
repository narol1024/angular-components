var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('sass', function() {
    gulp.src('./src/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./src/css/'))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(minifyCss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/css/'));
});
gulp.task('sass:watch', function() {
    gulp.watch('./src/sass/*.scss', ['sass']);
});

gulp.task('minifyjs',function(){
	return gulp.src('./src/js/*js')
		.pipe(gulp.dest('./dist/js/'))
		.pipe(uglify())
		.pipe(rename({suffix:'.min'}))
		.pipe(gulp.dest('./dist/js/'));
});
gulp.task('minifyjs:watch', function() {
    gulp.watch('./src/js/*js', ['minifyjs']);
});


//默认Gulp
gulp.task('default', ['sass:watch','minifyjs:watch'], function() {
    console.info("Gulp Start!");
});