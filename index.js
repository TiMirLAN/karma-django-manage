/**
 * Created by mta on 05.06.14.
 */
/*jslint node:true */
/*global console */
var path = require('path');


function Proc() {
    "use strict";
    function getTempFileDir() {
        var tmpDir = '';
        if (['TMPDIR', 'TMP', 'TEMP'].some(function (variable) {
                tmpDir = process.env[variable];
                return tmpDir != undefined;
            })) {
            return tmpDir.replace(/\/$/g, '');
        }
        return '/tmp';
    }

    function getTmpFilePath() {
        return getTempFileDir() + '/' + Date.now().toString(10) + '.txt';
    }

    var ffi = require('ffi'),
        fs = require('fs'),
        platform = new {
            win32: function Win32Platform() {
                var lib = new ffi.Library("./lib/proc", {
                    run: ["int", ["string", "string"]]
                });
                this.exec = function (cmd, tmpFilePath) {
                    return lib.run(cmd, tmpFilePath);
                };
            },
            linux: function LinuxPlatform() {
                var lib = new ffi.Library(null, {
                    "system": ["int32", ["string"]]
                });
                this.exec = function (cmd, tmpFilePath) {
                    return lib.system(cmd + ">" + tmpFilePath);
                };
            }
        }[process.platform]();

    this.exec = function (cmd) {
        var tmpFilePath = getTmpFilePath(),
            status;
        try {
            if (status = platform.exec(cmd, tmpFilePath)) {
                throw new Error('Process exit with code '+ status);
            }
            return fs.readFileSync(tmpFilePath).toString().replace(/(\n|\r)+$/g, '');
        } finally {
            fs.unlinkSync(tmpFilePath);
        }
    };
}

var djangoManagepyRunner = function (config, baseDir, files) {
    "use strict";
    var python = config.virtualenvDir ? path.join(baseDir, config.virtualenvDir, 'bin/python') : 'python',
        manage = path.join(baseDir, config.manageFile || 'manage.py'),
        managepyCommand = [python, manage].join(' '),
        proc = new Proc();

    function callManagepy(args) {
        return proc.exec([managepyCommand, args].join(' '));
    }

    if(config.command) {
        config.commands.forEach(function (command) {
            if (config.silent) {
                callManagepy(command);
            } else {
                console.log(callManagepy(command));
            }
        });
    }

    if (config.appendToFiles) {
        config.appendToFiles.forEach(function (command) {
            files.push({
                pattern: path.resolve(baseDir, callManagepy(command)),
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