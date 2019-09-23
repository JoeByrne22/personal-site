/// <binding />
var gulp = require('gulp'),
	requireDir = require( 'require-dir' ),
	browserSync = require('browser-sync');
global.waitingWatch = true;
global.uiAssetsPath = 'src/assets/'; // todo: use this instead on relevant tasks
global.envUmbr = false;

require('es6-promise').polyfill();
require('gulp-grunt')(gulp);
requireDir('gulp_tasks', { recurse: true } );

// Short tasks
gulp.task('set-env-dev', function() { global.env = 'dev' });
gulp.task('set-env-prod', function() { global.env = 'prod' }); 
gulp.task('assemble', ['grunt-assemble'], browserSync.reload);

// Global tasks
gulp.task('common', ['modernizr', 'copyAll', 'lint', 'sass-iconfont', 'assemble']);

gulp.task('dev', [
	'set-env-dev',
	'common',
	'browser-sync',
	'watch'
]);
 
gulp.task('build', [
	'set-env-prod',
	'copyDev'
]);

gulp.task('default', ['dev']);