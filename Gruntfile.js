module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		mochacov: {
			options: {
				slow: 5000,
				timeout: 15000,
				reporter: 'html-cov',
				output: 'coverage/index.html'
			},
			all: ['test/**/*.js']
		},
		mochaTest: {
			options: {
				slow: 5000,
				timeout: 15000,
				reporter: 'spec',
				ignoreLeaks: false
			},
			src: ['test/**/*.js']
		},
		jshint: {
			options: {
				jshintrc: true
			},
			src: ['*.js','lib/**/*.js','test/**/*.js']
		},
		clean: ['tmp']
	});

	// Load grunt plugins for modules
	grunt.loadNpmTasks('grunt-mocha-cov');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');

	// register tasks
	grunt.registerTask('coverage', ['mochacov']);
	grunt.registerTask('default', ['jshint', 'mochaTest', 'clean']);

};
