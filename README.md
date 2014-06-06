karma-django-manage
===================

Call Django manage.py command before test runs.

Install
-------

Run `npm install https://github.com/TiMirLAN/karma-django-manage/tarball/v0.6.1`

Usage
-----

In your karma config file:
* Add `django-manage` into frameworks section.
* Configure plugin with `djangoManage` object. ``djangoManage: {commands: [], manageFile: './manage.py'},``

### Example: ###

    module.exports = function (config) {
      "use strict";
      config.set({
        basePath: '',
        frameworks: ['jasmine', 'django-manage'],
        files: [],
        exclude: [],
        djangoManage: {
          virtualenvDir: './env',
          commands: ['dumpdata'],
          manageFile: './manage.py',
          silent: true
        },
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['PhantomJS'],
        singleRun: true
      });
    };


Configuraton
------------

__virtualenvDir__ - Path to virtualenv folder. (optional)  
__commands__ - List of `manage.py` commands, that should be executed.  
__manageFile__ - Path to `manage.py` file. (optional)  
__silent__ - If true, there are no command output in karma console. (optional)  
