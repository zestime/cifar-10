module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-mocha-test");
  grunt.loadNpmTasks("grunt-babel");
  grunt.loadNpmTasks("grunt-contrib-uglify");
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
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ['env']
      },
      dist: {
        files: [{
          "expand": true,
          "cwd": "src",
          "src": ["**/*.js"],
          "dest": "./",
          "flatten": true
        }]
      }
    },
    uglify: {
      my_target : {
        options: {
          sourceMap: true,
          sourceMapName:  'sourceMap.map'
        },
        src: 'index.js',
        dest: 'index.min.js'
      }
    }
  });

  grunt.registerTask("build", ['babel', 'uglify']);
  grunt.registerTask("default", "mochaTest");
}
