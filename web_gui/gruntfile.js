var fs = require('fs');

module.exports = function (grunt) {
    grunt.initConfig({
        browserify: {
            dev: {
                options: {
                    browserifyOptions: {
                        debug: true
                    },
                    transform: ["browserify-css", ["babelify", {presets: ['react', 'es2015']}]]
                },
                files: {
                    './build/bundle.js': 'app/**/*.js'
                }
            },
            build: {
                options: {
                    browserifyOptions: {
                        debug: false
                    },
                    transform: ["browserify-css", ["babelify", {presets: ['react', 'es2015']}]]
                },
                files: {
                    './build/bundle.js': 'app/**/*.js'
                }
            }
        },

        watch: {
            browserify: {
                files: ['./app/**/*.js', './app/**/*.css'],
                tasks: ['browserify:dev']
            },
            options: {
                nospawn: true
            }
        },

        babel: {
            options: {
                sourceMap: true,
                presets: ['babel-preset-es2015', 'babel-preset-react']
            },
            dist: {
                files: {
                    'dist/app.js': 'src/app.js'
                }
            }
        },

        jest: {
            options: {
                config: {
                    testDirectoryName: "spec",
                    rootDir: ".",
                    name:"",
                    scriptPreprocessor: "<rootDir>/node_modules/babel-jest",
                    unmockedModulePathPatterns: [
                        "<rootDir>/node_modules/react",
                        "<rootDir>/node_modules/react-dom",
                        "<rootDir>/node_modules/react-addons-test-utils"
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-serve');
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['browserify:dev']);
    grunt.loadNpmTasks('grunt-jest');
}
;
