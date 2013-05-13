module.exports = function (grunt) {
    grunt.initConfig({
        "pkg": grunt.file.readJSON("package.json"),
        "clean": {
            "build": [
                "build"
            ]
        },
        "copy": {
            "updateRunner": {
                "files": [
                    {
                        "expand": true,
                        "cwd": ".grunt/grunt-contrib-jasmine",
                        "src": ["*"],
                        "dest": "code/tests/built/"
                    },
                    {
                        "src": ["_SpecRunner.html"],
                        "dest": "code/tests/built/SpecRunner.html"
                    },
                    {
                        "expand": true,
                        "cwd": "build",
                        "src": ["valerie-*.js"],
                        "dest": "code/tests/built/"
                    }
                ]
            }
        },
        "concat": {
            "core": {
                "src": [
                    "license.js",
                    "code/core/valerie.js",
                    "code/core/valerie.utils.js",
                    "code/core/valerie.formatting.js",
                    "code/core/valerie.dom.js",
                    "code/core/valerie.validationResult.js",
                    "code/core/valerie.converters.js",
                    "code/core/valerie.knockout.extras.js",
                    "code/core/valerie.knockout.js",
                    "code/core/valerie.knockout.bindings.js"
                ],
                "dest": "build/valerie-for-knockout-core.js"
            },
            "full": {
                "src": [
                    "build/valerie-for-knockout-core.js",
                    "code/full/valerie.numericHelper.js",
                    "code/full/valerie.converters.js",
                    "code/full/valerie.rulesjs",
                    "code/full/valerie.knockout.fluent.converters.js",
                    "code/full/valerie.knockout.fluent.rules.js"
                ],
                "dest": "build/valerie-for-knockout.js"
            },
            "en-gb": {
                "src": [
                    "build/valerie-for-knockout.js",
                    "code/localisation/en-gb/core.js",
                    "code/localisation/en-gb/full.js",
                    "code/localisation/en-gb/valerie.converters.en-gb.js",
                    "code/localisation/en-gb/valerie.knockout.fluent.converters.en-gb.js"
                ],
                "dest": "build/valerie-for-knockout-en-gb.js"
            }
        },
        "jasmine": {
            "build": {
                "src": "build/valerie-for-knockout-en-gb.js",
                "options": {
                    "keepRunner": true,
                    "specs": [
                        "code/tests/core/*.tests.js"
                    ],
                    "vendor": [
                        "code/tests/runnerScripts/ddr-ecma5-1.2.1-min.js",
                        "code/tests/runnerScripts/jasmine-tap.js",
                        "code/tests/runnerScripts/jasmine-tap-helper.js",
                        "code/thirdParty/html5shiv.js",
                        "code/thirdParty/json3.min.js",
                        "code/thirdParty/knockout-2.2.1.debug.js",
                        "code/thirdParty/jquery-1.9.1.min.js"
                    ]
                }
            }
        },
        "jshint": {
            "options": {
                "eqnull": true
            },
            "files": {
                "src": [
                    "build/*.js"
                ]
            }
        },
        "shell": {
            "docs": {
                "command": "jsdoc -c jsdoc.conf.json",
                "stdout": true,
                "stderr": true
            }
        },
        "sed": {
            "updateRunner1": {
                "pattern": /(\.\/)?.grunt\/grunt-contrib-jasmine\//g,
                "replacement": "",
                "path": "code/tests/built/SpecRunner.html"
            },
            "updateRunner2": {
                "pattern": /\.\/code\//g,
                "replacement": "../../",
                "path": "code/tests/built/SpecRunner.html"
            },
            "updateRunner3": {
                "pattern": /\.\/build\//g,
                "replacement": "",
                "path": "code/tests/built/SpecRunner.html"
            }
        },
        "uglify": {
            "options": {
                "banner": '/* valeriejs - MIT license - (c) egrove Ltd (egrove.co.uk) */\n'
            },
            "build": {
                "files": [
                    {
                        "expand": true,
                        "cwd": "build",
                        "src": "*.js",
                        "dest": "build/",
                        "ext": ".min.js"
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-shell");
    grunt.loadNpmTasks("grunt-sed");

    grunt.registerTask("default", [
        "build"
    ]);

    grunt.registerTask("concatAndHint", [
        "clean:build",
        "concat:core",
        "concat:full",
        "concat:en-gb",
        "jshint"
    ]);

    grunt.registerTask("test", [
        "concatAndHint",
        "jasmine"
    ]);

    grunt.registerTask("build", [
        "test",
        "copy:updateRunner",
        "sed:updateRunner1",
        "sed:updateRunner2",
        "sed:updateRunner3",
        "uglify"
    ]);

    grunt.registerTask("docs", [
        "shell:docs"
    ]);
}
