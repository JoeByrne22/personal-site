'use strict';

module.exports = function(grunt) {

	grunt.config('assemble', {
		project: {
			options: {
				flatten: true,
				layout: 'src/templates/layouts/default.hbs',
				data: 'src/data/*.json',
				partials: 'src/templates/partials/**/*.hbs'
			},
			files: {
				'dist/': ['src/templates/pages/*.hbs' ],
			}
		}
	});

	grunt.loadNpmTasks('grunt-assemble');
	grunt.registerTask('grunt-assemble', ['assemble']);
};
