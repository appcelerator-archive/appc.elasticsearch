module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    mochaTest: {
      options: {
        timeout: 30000,
        reporter: 'spec'
      },
      src: ['test/integration/**/*.js']
    }
  })

  // Load grunt plugins for modules
  grunt.loadNpmTasks('grunt-mocha-test')

  // register tasks
  grunt.registerTask('default', ['mochaTest'])
}
