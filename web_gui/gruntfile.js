var fs = require('fs');

module.exports = function (grunt) {
    grunt.initConfig({
        browserify: {
            dev: {
                options: {
                    debug: true,
                    transform: ["browserify-css", ["babelify", {presets: ['react']}]]
                },
                files: {
                    './build/bundle.js': 'app/**/*.js'
                }
            },
            build: {
                options: {
                    debug: false,
                    transform: ["browserify-css", ["babelify", {presets: ['react']}]]
                },
                files: {
                    './build/bundle.js': 'app/**/*.js'
                }
            }
        },

        watch: {
            browserify: {
                files: ['./app/**/*.js'],
                tasks: ['browserify:dev']
            },
            options: {
                nospawn: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-serve');
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['browserify:build']);
};
