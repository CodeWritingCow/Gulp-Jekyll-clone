var gulp = require('gulp'),
	concat = require('gulp-concat'),
	clean = require('gulp-rimraf'),
	cssmin = require('gulp-minify-css'),
	jsValidate = require('gulp-jsvalidate'),
	notify = require('gulp-notify'),
	uglify = require('gulp-uglify'),
	jasmine = require('gulp-jasmine'),
	webserver = require('gulp-webserver'),
	markdown = require('gulp-markdown'),
	tap = require('gulp-tap'),
	Handlebars = require('Handlebars'),
	rename = require('gulp-rename'),
	path = require('path');

var	_ = require('underscore');

var Data = {
	pages: []
};


gulp.task('clean', [], function() {
	console.log("Clean all files in build folder");

	return gulp.src("build/*", { read: false }).pipe(clean());
});

gulp.task('css', ['clean'], function() {
	console.log("Concatenate, move and minify all CSS files in styles folder");
	return gulp.src("contents/styles/**.css")
		.pipe(concat('main.min.css'))
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

gulp.task('homepage', ['clean'], function() {
	return gulp.src('contents/index.hbs')
			   .pipe(tap(function(file, t) {
			   	var template = Handlebars.compile(file.contents.toString());
			   	var html = template({ title: "Gulp + Handlebars is easy"});
			   	file.contents = new Buffer(html, "utf-8");
			   }))
			   .pipe(rename(function(path) {
			   	path.extname = ".html";
			   }))
			   .pipe(gulp.dest('build/pages'));
});

gulp.task('default', ['css', 'homepage', 'javascript']);

gulp.task('watch', [], function() {
	return gulp.watch(['contents/**'], ['default']);
});

gulp.task('webserver', function() {
	return gulp.src('build')
			   .pipe(webserver({ livereload: true }));
});

gulp.task('generate_pages', function() {
	return gulp.src('contents/page.hbs')
			   .pipe(tap(function(file) {
			   	var template = Handlebars.compile(file.contents.toString());

			   	return gulp.src('contents/pages/**.md')
						   .pipe(tap(function(file) {

						   	var name = path.basename(file.path, ".md");
						   	var contents = file.contents.toString();
						   	var index = contents.indexOf("---");

						   	if (index !== -1) {
						   		var data = JSON.parse(contents.slice(0, index));
						   		data.name = name;
						   		data.url = "/pages/" + file.relative.replace(".md", ".html");
						   		Data.pages.push(data);
						   		contents = contents.slice(index+3, contents.length);
						   		file.contents = new Buffer(contents, "utf-8");
						   	}
						   }))
						   .pipe(markdown())
						   .pipe(tap(function(file) {
						   	var name = path.basename(file.path, ".html");
						   	var data = _.findWhere(Data.pages, { name: name });
						   	data.contents = file.contents.toString();
						   	var html = template(data);
						   	file.contents = new Buffer(html, "utf-8");
						   }))
						   .pipe(gulp.dest('build/pages'));
						}));
});