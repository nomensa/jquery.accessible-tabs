'use strict';

module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Project configuration
    grunt.initConfig({

        //Start a connect web server
        connect: {
            server: {
                options: {
                    livereload: 35729,
                    hostname: '0.0.0.0',
                    port: 9001
                }
            }
        },

        // Validate files with JSHint
        jshint: {
            options: {
                globals: {
                    '$': true,
                    'jQuery': true
                },
                jshintrc: '.jshintrc'
            },
            files: [
                'Gruntfile.js',
                'jquery.accTabs.js'
            ],
        },

        // Task for checking JavaScript Code Style with jscs
        jscs: {
            options: {
                config: '.jscsrc'
            },
            files: [
                'Gruntfile.js',
                'jquery.accTabs.js'
            ]
        },

        // Minify files with UglifyJS
        uglify: {
            options: {
                preserveComments: 'some'
            },
            target: {
                files: {
                    'jquery.accTabs.min.js': ['jquery.accTabs.js']
                }
            }
        },

        // Grunt plugin for Karma
        karma: {
            all: {
                configFile: 'karma.conf.js'
            }
        },

        watch: {
            options: {
                debounceDelay: 250,
                livereload: 35729
            },
            html: {
                files: [
                    'index.html',
                ]
            },
            js: {
                files: [
                    'jquery.accTabs.js',
                ],
                tasks: [
                    'uglify'
                ]
            },
            test: {
                files: [
                    'Gruntfile.js',
                    'jquery.accTabs.js',
                    'jquery.accTabs.spec.js'
                ],
                tasks: [
                    'karma',
                    'jshint',
                    'jscs'
                ]
            }
        },
        version: {
            options: {
                prefix: '@version:\\s+[\'"]'
            },
            src: [
                'jquery.accTabs.js',
                'jquery.accTabs.min.js'
            ]
        }
    });

    grunt.registerTask('default', 'watch (@options: --connect)', function() {
    /**
     * Defaut task
     * $ grunt
     * @options: --connect (run watch with a connect web server)
     */
        if ( grunt.option('connect') ) {
            grunt.task.run([
                'connect',
                'watch'
            ]);
        } else {
            grunt.task.run([
                'watch'
            ]);
        }
    });

    grunt.registerTask('test', ['jshint', 'jscs', 'karma']);

    grunt.registerTask('release', ['test', 'uglify', 'version']);
};