/**
 * Created by mta on 05.06.14.
 */
/*jslint node:true */
/*global console */
var exec_sync = require('exec-sync'),
    path = require('path');

console.log('Django loaded');
var djangoManagepyRunner = function (config, baseDir) {
    "use strict";
    var python = config.virtualenvDir ? path.join(baseDir, config.virtualenvDir, 'bin/python') : 'python',
        manage = path.join(baseDir, config.manageFile || 'manage.py'),
        managepyCommand = [python, manage].join(' ');

    function callManagepy(args) {
        return exec_sync([managepyCommand, args].join(' '));
    }

    config.commands.forEach(function (command) {
        if (config.silent) {
            callManagepy(command);
        } else {
            console.log(callManagepy(command));
        }
    });
};

djangoManagepyRunner.$inject = ['config.djangoManage', 'config.basePath'];

module.exports = {
    'framework:django-manage': ['factory', djangoManagepyRunner]
};