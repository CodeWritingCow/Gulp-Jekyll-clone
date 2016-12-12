var gulp = require('gulp'),
	concat = require('gulp-concat'),
	clean = require('gulp-rimraf'),
	cssmin = require('gulp-minify-css'),
	jsValidate = require('gulp-jsvalidate'),
	notify = require('gulp-notify'),
	uglify = require('gulp-uglify'),
	jasmine = require('gulp-jasmine');

gulp.task('clean', [], function() {
	console.log("Clean all files in build folder");

	return gulp.src("build/*", { read: false }).pipe(clean());
});

gulp.task('default', ['clean'], function() {
	console.log("Concatenate, move and minify all CSS files in styles folder");
	return gulp.src("contents/styles/**.css")
		.pipe(concat('main.css'))
		.pipe(cssmin())
		.pipe(gulp.dest("build/styles"));
});

gulp.task('javascript', function() {
	console.log('Validate, Concat, Uglify and Move all JavaScript files');
	return gulp.src('contents/javascript/**.js')
			   .pipe(jsValidate())
			   .on('error', notify.onError(function(error) {
			   	return error.message;
			   }))
			   .pipe(uglify())
			   .pipe(concat('main.js'))
			   .pipe(gulp.dest('build/javascript'));
});

gulp.task('specs', function() {
	return gulp.src('specs/**.js')
			   .pipe(jasmine());
});

gulp.task('spec-watch', function() {
	gulp.watch(['specs/**.js', 'contents/javascript/**.js'], ['specs']);
});