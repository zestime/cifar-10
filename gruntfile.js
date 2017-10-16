module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-mocha-test");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
          reporter: "spec",
          require: ["babel-register", "babel-polyfill"]
        },
        src: ["test/**/*.js"]
      }
    },
    watch: {
      js: {
        options: {
          spawn: false,
        },
        files: ['src/**/*.js','test/**/*.js'],
        tasks: ['default']
      }
    }
  });

  grunt.registerTask("default", "mochaTest")
}
