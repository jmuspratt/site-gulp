/*!
* gulp
* $ npm install gulp-header gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
* Adapted from http://markgoodyear.com/2014/01/getting-started-with-gulp/  
*/

// Load plugins
var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	cache = require('gulp-cache'),
	// livereload = require('gulp-livereload'),
	del = require('del'),
	header = require('gulp-header'), // http://ponyfoo.com/articles/choose-grunt-gulp-or-npm
	pkg = require('gulp/package.json'), 
	info = '// <%= pkg.name %>@v<%= pkg.version %>, <%= pkg.license %>\n'
;
	

// Styles
gulp.task('styles', function() {
	return sass('src/styles/', {
		style: 'expanded' // or 'nested'
	})
	.on('error', function (err) {
		console.error('Error!', err.message);
	})
	.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	.pipe(gulp.dest('build/styles'))
	.pipe(rename({ suffix: '.min' }))
	.pipe(minifycss())
	.pipe(gulp.dest('build/styles'))
	.pipe(notify({ message: 'Styles task complete' }));
});

// js
gulp.task('js', function() {
	return gulp.src(['src/js/jquery-1.11.0.min.js', 'src/js/**/*.js']) // load jquery first, then everything else
	// .pipe(jshint())
	// .pipe(jshint.reporter('default'))
	.pipe(concat('main.js'))
	.pipe(gulp.dest('build/js'))
	.pipe(rename({ suffix: '.min' }))
	.pipe(uglify())
	.pipe(header(info, { pkg : pkg }))
	.pipe(gulp.dest('build/js'))
	.pipe(notify({ message: 'js task complete' }));
});

// Images
// See https://www.npmjs.org/package/gulp-imagemin (optimizationLevel != JPG compression)
gulp.task('images', function() {
	return gulp.src('src/images/**/*')
	.pipe(cache(imagemin({ optimizationLevel: 3, progressive: false, interlaced: false }))) 
	.pipe(gulp.dest('build/images'))
	.pipe(notify({ message: 'Images task complete' }));
});

// Clean
gulp.task('clean', function(cb) {
	del(['build/assets/styles', 'build/assets/js', 'build/assets/img'], cb)
});

// Default task
gulp.task('default', ['clean'], function() {
	gulp.start('styles', 'js', 'images');
});

// Watch
gulp.task('watch', function() {

	// Watch .scss files
	gulp.watch('src/styles/**/*.scss', ['styles']);

	// Watch .js files
	gulp.watch('src/js/**/*.js', ['js']);

	// Watch image files
	gulp.watch('src/images/**/*', ['images']);

	// Create LiveReload server
	// livereload.listen();

	// Watch any files in build/, reload on change
	// gulp.watch(['build/**']).on('change', livereload.changed);

});