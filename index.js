/**
 * Created by mta on 05.06.14.
 */
/*jslint node:true, nomen:true */
/*global console, __dirname */
var path = require('path'),
    pse = require('node-pipedexec');


var djangoManagepyRunner = function (config, baseDir, files) {
    "use strict";
    var platformEnvPythonDir = /^win/.test(process.platform) ? 'Scripts' : 'bin',
        python = config.virtualenvDir ? path.join(
            baseDir,
            config.virtualenvDir,
            platformEnvPythonDir,
            'python'
        ) : 'python',
        manage = path.join(baseDir, config.manageFile || 'manage.py');

    function callManagepy(args) {
        return pse.exec.apply(null, [python, manage].concat(args.split(' ')));
    }

    if (config.command) {
        config.commands.forEach(function (command) {
            if (config.silent) {
                callManagepy(command);
            } else {
                console.log(callManagepy(command).out);
            }
        });
    }

    if (config.appendToFiles) {
        config.appendToFiles.forEach(function (command) {
            files.push({
                pattern: path.resolve(baseDir, callManagepy(command).out),
                included: true,
                served: true,
                watched: false
            });
        });
    }
};

djangoManagepyRunner.$inject = ['config.djangoManage', 'config.basePath', 'config.files'];

module.exports = {
    'framework:django-manage': ['factory', djangoManagepyRunner]
};
