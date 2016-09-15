module.exports = function(grunt) {

    distributionPath = 'app/dist/';
    developmentPath = 'app/';

    devSources = {
        js: {
            angular: [
                "app/bower_components/angular/angular.js",
                "app/bower_components/angular-route/angular-route.js"
            ],
            app: [
                "app/assets/js/app.js",
                "app/sections/uxmap/uxmap-full.js"
            ],
            third: [
                "app/bower_components/html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js"
            ]
        },
        less: {
            app: [
                "app/assets/css/xmap.less"
            ]
        },
        css: {
            app: [
                "app/assets/css/xmap.css"
            ],
            boilerPlate: [
                "app/bower_components/html5-boilerplate/dist/css/normalize.css",
                "app/bower_components/html5-boilerplate/dist/css/main.css"
            ]
        }
    };

    var buildSources = {
        js: {
            angular: "app/assets/js/angular.min.js",
            app: "app/assets/js/application.js",
            third: "app/assets/js/third.min.js"
        },

        css: {
            app: "app/assets/css/app.min.css",
            boilerPlate: "app/assets/css/normalize.min.css"
        }
    }


    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                files: {
                    'app/dist/app/assets/js/uxmap.min.js': devSources.js.app,
                    'app/dist/app/assets/js/angular.min.js': devSources.js.angular,
                    'app/dist/app/assets/js/third.min.js': devSources.js.third,
                }
            }
        },
        copy: {
            build: {
                expand: true,
                src: ['app/sections/**/*.html', 'app/assets/ui/css/images/**', 'app/assets/ui/css/fonts/**', 'app/assets/ui/css/*.css'],
                dest: 'app/dist/',
            }
        },
        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    "app/assets/ui/css/xmap.css": devSources.less.app,
                    "app/assets/ui/css/boilerPlate.css": devSources.css.boilerPlate // destination file and source file
                }
            }
        },
        watch: {
            styles: {
                files: ['assets/css/**/*.less'], // which files to watch
                tasks: ['less', 'cssmin'],
                options: {
                    nospawn: true
                }
            },
            html: {
                files: ['builder/*.html'], // which files to watch
                tasks: ['string-replace'],
                options: {
                    nospawn: true
                }
            }
        },
        'string-replace': {
            dev: {
                files: {
                    'app/index.html': 'builder/index.tmpl.html'
                },
                options: {
                    replacements: [
                        // place files inline example
                        {
                            pattern: /<!-- @include (.*?) -->/ig,
                            replacement: function(match, p1) {
                                return replacements(match, p1, "devSources");
                            }
                        }
                    ]
                }
            },
            build: {
                files: {
                    'app/dist/index.html': 'builder/index.tmpl.html'
                },
                options: {
                    replacements: [
                        // place files inline example
                        {
                            pattern: /<!-- @include (.*?) -->/ig,
                            replacement: function(match, p1) {
                                return replacements(match, p1, "buildSources");
                            }
                        }
                    ]
                }
            }
        },
        browserSync: {
            bsFiles: {
                src: ['app/dist/assets/**/*']
            },
            options: {
                server: {
                    baseDir: "./app/dist/"
                }
            }
        }
    });


    function replacements(match, p1, resourceOrigin) {

        var resources = {
            js: '<script src="{{1}}"></script>',
            css: '<link rel="stylesheet" href="{{1}}">'
        };

        var resource = '';
        var p1Array = eval(resourceOrigin + "." + p1);
        var js = resources.js;
        var css = resources.css;

        grunt.log.writeln(p1);

        if (p1.indexOf('js.') !== -1) {
            resource += "<!-- " + p1 + " -->\n";
            if (typeof p1Array === 'object') {
                for (var i = 0; i < p1Array.length; i++) {

                    resource += js.replace('{{1}}', p1Array[i]) + "\n";
                    grunt.log.writeln(resource);
                }
            } else {

                resource += js.replace('{{1}}', p1Array) + "\n";
            }
        } else if (p1.indexOf('css.') !== -1) {
            resource += "<!-- " + p1 + " -->\n";
            if (typeof p1Array === 'object') {
                for (var j = 0; j < p1Array.length; j++) {

                    resource += css.replace('{{1}}', p1Array[j]) + "\n";
                    grunt.log.writeln(resource);
                }
            } else {

                resource += js.replace('{{1}}', p1Array) + "\n";
            }
        }
        grunt.log.writeln('Resource: ', resource);
        return resource;
    }

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-browser-sync');

    // Default task(s).
    grunt.registerTask('sreplace', ['string-replace']);
    grunt.registerTask('default', ['uglify', 'less', 'string-replace', 'copy']);

};
