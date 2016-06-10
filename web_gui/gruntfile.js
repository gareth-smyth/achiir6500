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
            dist: {
                files: {
                    'dist/app.js': 'src/app.js'
                }
            }
        },

        jest: {
            unit: {
                options: {
                    config: {
                        collectCoverage: true,
                        testDirectoryName: "spec",
                        rootDir: ".",
                        name: "",
                        unmockedModulePathPatterns: [
                            "node_modules"
                        ]
                    }
                }
            },
            scenario: {
                options: {
                    config: {
                        testDirectoryName: "scenario_spec",
                        rootDir: ".",
                        name: "",
                        unmockedModulePathPatterns: [
                            "node_modules"
                        ]
                    }
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
                includes: ["(.*?)"],
                excludes: ['main.js'],
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
        },

        assemblyinfo: {
            options: {
                files: ['../src/achiir6500.sln'],
                info: {
                    version: '0.4.0',
                    fileVersion: '0.4.0'
                }
            }
        },

        msbuild: {
            server: {
                src: ['../server/server.csproj'],
                options: {
                    projectConfiguration: 'Debug',
                    targets: ['Build'],
                    stdout: true
                }
            },
            test:{
                src: ['../server_test/server_test.csproj'],
                options: {
                    projectConfiguration: 'Debug',
                    targets: ['Build'],
                    stdout: true
                }
            }
        },

        shell: {
            nunit: {
                command: 'opencover.console.exe -register:user -target:nunit3-console.exe -targetargs:"../server_test/server_test.csproj"'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-serve');
    grunt.loadNpmTasks('grunt-code-coverage-enforcer');
    grunt.loadNpmTasks('grunt-jest');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-dotnet-assembly-info');
    grunt.loadNpmTasks('grunt-msbuild');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('server-build', ['assemblyinfo']);
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['browserify:dev']);
    grunt.registerTask('jstest', ['jest:unit', 'string-replace', 'code-coverage-enforcer']);
    grunt.registerTask('test-server', ['msbuild:test', 'shell:nunit']);
    grunt.registerTask('test', ['test-server', 'jstest', 'jest:scenario']);
    grunt.registerTask('js-scenario', ['jest:scenario']);
};
