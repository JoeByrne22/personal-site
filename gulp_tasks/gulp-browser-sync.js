var gulp = require('gulp'),
	browserSync = require('browser-sync');

gulp.task('browser-sync', ['assemble'], function() {
	return browserSync.init({
		server: {
			baseDir: './dist',
			serveStaticOptions: {
		        extensions: [ 'html' ]
		    }
		},
		// Redirection for Product Filter/Search
		// https://vinaygopinath.me/blog/tech/url-redirection-with-browsersync/
		middleware: function( req, res, next ) {

			var productRegExp = new RegExp( /(products.html\/|products\/)(brand|category|search|style).*$/ );

			if ( productRegExp.test( req.url ) )
				req.url = '/inspiration/products.html';

			return next();
		}
	});
});