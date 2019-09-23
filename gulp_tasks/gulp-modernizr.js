var fs = require('fs'),
	gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	modernizr = require('modernizr');

var config = {
	"options": [
		"setClasses",
		"addTest",
		"html5printshiv",
		"testProp",
		"fnBind"
	],
	"feature-detects": [
		"css/objectfit",
		"touchevents"
	]
}
// You can add required feature detects to the above config.
// Full list here: https://github.com/Modernizr/Modernizr/blob/master/lib/config-all.json

gulp.task( 'buildModernizr', function (done) {
	modernizr.build(config, function(code) {
		fs.writeFile('./src/assets/js/vendor/modernizr-build.js', code, done);
	});
});

gulp.task('uglifyModernizr', ['buildModernizr'], function() {
	return gulp.src('./src/assets/js/vendor/modernizr-build.js')
		.pipe(concat('modernizr.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./dist/assets/js/'));
});

gulp.task('modernizr', ['uglifyModernizr']);