var gulp = require('gulp'),
	rimraf = require('rimraf');;

gulp.task('clean', function (cb) {
	return rimraf('./dist', cb);
});