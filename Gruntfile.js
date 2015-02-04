'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        connect: {
            demo: {
                options: {
                    port: 8020,
                    base: '.',
                    hostname: '*'
                }
            }
        },
        browserify: {
            dist: {
                files: {
                    'dist/app.js': ['src/app.js'],
                },
                options: {
                    transform: ['6to5ify']
                }
            }
        },
        watch: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['browserify']
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['browserify', 'connect', 'watch']);
};