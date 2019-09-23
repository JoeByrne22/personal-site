var gulp = require('gulp'),
	browserSync = require('browser-sync'),
	notify = require('gulp-notify');

gulp.task('watch', ['browser-sync'], function() {
	global.waitingWatch = false;
	console.log(global.waitingWatch);
	// Watch for css changes
	gulp.watch('src/assets/scss/**/*', ['sass']);
	// Watch for html changes
	gulp.watch(['src/templates/**/*', 'src/data/**/*'], ['assemble']);
	// Watch for js changes
	gulp.watch([
		'src/assets/js/**/*',
		'src/assets/data/**/*'
	], ['lint']);
	// Watch for map-data changes
	gulp.watch('src/assets/data/map/**/*', ['copyMapData']);
	// Watch for new images
	gulp.watch('src/assets/img/**/*.*', ['copyImages']);
	// Watch for new images, and minify them
	gulp.watch('src/assets/img/**/*.*', ['imagemin']);
	// Watch for new icons
	gulp.watch('src/assets/img/icons/**/*.svg', ['sass-iconfont']);
	// Watch for vendor js changes
	gulp.watch('src/assets/js/vendor/**/*.js', ['copyVendor']);

	// Refresh browser
	gulp.watch([
		'dist/**/*',
		'!dist/assets/css/**/*',
		// '!dist/assets/fonts/icons.*',
		'!dist/**/*.html',
		'!dist/**/*.{jpg,png,gif,svg}'
	]).on('change', browserSync.reload);

	notify({
		title: 'VR',
		message: 'Changes have been applied!'
	});
});

 