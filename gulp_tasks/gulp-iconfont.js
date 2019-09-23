var gulp = require('gulp'),
	iconfont = require('gulp-iconfont'),
	iconfontCss = require('gulp-iconfont-css'),
	gulpif = require('gulp-if'),
	debug = require('gulp-debug');

var fontName = 'icons';

gulp.task('iconfont', function(){
	return gulp.src(['./src/assets/img/icons/**/*.svg'])
		.pipe(iconfontCss({
			path:  './src/assets/img/icons/template.scss',
			fontName: fontName,
			targetPath: '../../../src/assets/scss/includes/_icons.scss',
			fontPath: '../fonts/',
			cssClass: 'webfont'
		}))
		.pipe(iconfont({
			fontName: fontName,
			formats: ['svg', 'ttf', 'eot', 'woff'],
			normalize: true,
			prependUnicode: true
		 }))
		.pipe(gulp.dest('./dist/assets/fonts/'));
});