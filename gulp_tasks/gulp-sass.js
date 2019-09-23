var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	combineMq = require('gulp-combine-mq'),
	browserSync = require('browser-sync'),
	gulpif = require('gulp-if'),
	cleanCss = require('gulp-clean-css'),
	sourceMaps = require('gulp-sourcemaps');

var sassOptions = {
	quiet: true,
	includePaths: require('node-neat').includePaths,
	imagePath: '../img/',
	precision: 4,
	outputStyle: 'nested'
};

var autoprefixerOptions = {
	browsers: ['last 4 versions', 'ie 9']
};

// used in 'gulp-dev' (first time it fires) and 'gulp-build'
gulp.task('sass-iconfont', ['iconfont'], function () {

		// SASS (dist)
	return gulp.src('./src/assets/scss/**/*.scss')
		.pipe(sourceMaps.init())
		.pipe(sass(sassOptions).on('error', sass.logError))
		.pipe(autoprefixer(autoprefixerOptions))
		.pipe(gulpif(global.env === 'prod', combineMq()))
		.pipe(gulpif(global.env === 'prod', cleanCss()))
		.pipe(sourceMaps.write('./maps'))
		.pipe(gulp.dest('./dist/assets/css/'))
		.pipe(gulpif(global.waitingWatch === false, browserSync.stream()));

		// SASS (static, for non-eu sites)
	return gulp.src('./src/assets/scss/**/*.scss')
		.pipe(sass(sassOptions).on('error', sass.logError))
		.pipe(autoprefixer(autoprefixerOptions))
		.pipe(gulpif(global.env === 'prod', combineMq()))
		.pipe(gulpif(global.env === 'prod', cleanCss()))
		.pipe(gulp.dest('./static/assets/css/'))
		.pipe(gulpif(global.waitingWatch === false, browserSync.stream()));

		// SASS (icons for DotNet Icon Picker)
	return gulp.src('./src/assets/scss/includes/icons.scss')
		.pipe(sass(sassOptions).on('error', sass.logError))
		.pipe(autoprefixer(autoprefixerOptions))
		.pipe(gulpif(global.env === 'prod', combineMq()))
		.pipe(gulpif(global.env === 'prod', cleanCss()))
		.pipe(gulp.dest('./dist/assets/css/'))
		.pipe(gulpif(global.waitingWatch === false, browserSync.stream()));
});

// used in 'gulp-dev' and 'gulp-dev-umbraco' (gulp-watch)
gulp.task('sass', function () {

		// SASS (dist)
	return gulp.src('./src/assets/scss/**/*.scss')
		.pipe(sourceMaps.init())
		.pipe(sass(sassOptions).on('error', sass.logError))
		.pipe(autoprefixer(autoprefixerOptions))
        .pipe(sourceMaps.write('./maps'))
		.pipe(gulp.dest('./dist/assets/css/'))
		.pipe(gulpif(global.waitingWatch === false, browserSync.stream()));

		// SASS (static, for non-eu sites)
	return gulp.src('./src/assets/scss/**/*.scss')
		.pipe(sass(sassOptions).on('error', sass.logError))
		.pipe(autoprefixer(autoprefixerOptions))
		.pipe(gulp.dest('./static/assets/css/'))
		.pipe(gulpif(global.waitingWatch === false, browserSync.stream()));
});