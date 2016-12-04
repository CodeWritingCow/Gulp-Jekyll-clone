var gulp = require('gulp'),
	concat = require('gulp-concat'),
	clean = require('gulp-rimraf'),
	cssmin = require('gulp-minify-css');

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