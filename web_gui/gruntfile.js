var fs = require('fs');

module.exports = function (grunt) {
    var rootFolder = new RegExp("(" + process.cwd().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ")", "g");
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
                    collectCoverage: true,
                    testDirectoryName: "spec",
                    rootDir: ".",
                    name: "",
                    scriptPreprocessor: "<rootDir>/node_modules/babel-jest",
                    unmockedModulePathPatterns: [
                        "<rootDir>/node_modules/react",
                        "<rootDir>/node_modules/react-dom",
                        "<rootDir>/node_modules/react-addons-test-utils"
                    ]
                }
            }
        },

        "code-coverage-enforcer": {
            options: {
                lcovfile: "./coverage/lcov.info",
                lines: 100,
                functions: 100,
                branches: 100,
                src: "./app",
                failBuild: false
            }
        },

        "string-replace": {
            dist: {
                src: './coverage/lcov.info',
                dest: './coverage/lcov.info',
                options: {
                    replacements: [
                        {
                            pattern: rootFolder,
                            replacement: ''
                        },
                        {
                            pattern: /(\\)/g,
                            replacement: '/'
                        }
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-serve');
    grunt.loadNpmTasks('grunt-code-coverage-enforcer');
    grunt.loadNpmTasks('grunt-jest');
    grunt.loadNpmTasks('grunt-string-replace');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['browserify:dev']);
    grunt.registerTask('test', ['jest', 'string-replace', 'code-coverage-enforcer'])
};
