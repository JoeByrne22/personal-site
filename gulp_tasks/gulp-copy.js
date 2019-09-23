var gulp = require('gulp'),
	gulpif = require('gulp-if'),
	multiDest = require('gulp-multi-dest'),
	imagemin = require('gulp-imagemin');

gulp.task('copyMain', function () {
	gulp.src([
			'./src/*.{ico,png,txt}',
		])
	.pipe(gulp.dest('./dist/'));
	gulp.src([
			'./src/assets/js/vendor/*.js',
			'!./src/assets/js/vendor/mapplic.js'
		])
	.pipe(gulp.dest('./dist/assets/js/'));
	gulp.src([
			'./src/assets/fonts/{,*/}*.*',
		])
	.pipe(gulp.dest('./dist/assets/fonts/'));
	gulp.src([
			'./src/assets/img/icons/MapKeyIconPicker.controller.js',
		])
	.pipe(gulp.dest('./dist/assets/img/icons/'));
});

gulp.task('copyImages', function () {
	gulp.src([
			'./src/assets/img/src/**/*.*',
		])
	.pipe(gulp.dest('./dist/assets/img/src/'));
	gulp.src([
			'./src/assets/favicon/**/*.*',
		])
	.pipe(gulp.dest('./dist/assets/favicon/'));
	gulp.src([
			'./src/assets/img/logo/**/*.*',
		])
	.pipe(gulp.dest('./dist/assets/img/logo/'));
});

gulp.task('copyVideo', function () {
	gulp.src([
			'./src/assets/video/**/*.*',
		])
	.pipe(gulp.dest('./dist/assets/video/'));
});

gulp.task('copyDocs', function () {
	gulp.src([
			'./src/assets/docs/**/*.*',
		])
	.pipe(gulp.dest('./dist/assets/docs/'));
});


 gulp.task('imagemin', function() {
	gulp.src('./src/assets/img/src/*')
	.pipe(imagemin())
    .pipe(gulp.dest('./dist/assets/img/src/'))
	.pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.jpegtran({progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo({
        plugins: [
            {removeViewBox: true},
            {cleanupIDs: false}
        ]
    })
]))
});
 

gulp.task('copyAll', ['copyMain','imagemin', 'copyImages','copyVideo', 'copyDocs']);

