// Filename: main.js

if (window.location.protocol === 'http:') {
    var baseUrl = '/static/xoces/js';
} else {
    var baseUrl = '/xoces-author/static/xoces/js';
}

require.config({
    baseUrl: baseUrl,
    paths: {
        'backbone'              : 'vendor/backbone/backbone-min',
        'backbone.babysitter'   : 'vendor/backbone.babysitter/lib/backbone.babysitter.min',
        'backbone.radio'        : 'vendor/backbone.radio/build/backbone.radio.min',
        'bootstrap'             : 'vendor/bootstrap/dist/js/bootstrap.min',
        'bootstrap-dialog'      : 'vendor/bootstrap-dialog',
        'cookies'               : 'vendor/js-cookie/src/js.cookie',
        'csrf'                  : 'vendor/csrf',
        'jquery'                : 'vendor/jquery/dist/jquery.min',
        'jquery-select2'        : '//cdnjs.cloudflare.com/ajax/libs/select2/3.4.6/select2.min',
        'jquery-ui'             : 'vendor/jquery-ui/jquery-ui.min',
        'marionette'            : 'vendor/backbone.marionette/lib/backbone.marionette.min',
        'underscore'            : 'vendor/lodash/lodash.min'
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'bootstrap-dialog': {
            deps: ['bootstrap','jquery'],
            exports: 'BootstrapDialog'
        },
        'cookies': {
            exports: 'Cookies'
        },
        'csrf': {
            deps: ['jquery']
        },
        'jquery-select2': {
            deps: ['jquery']
        },
        'jquery-ui': {
            deps: ['jquery']
        }
    }
});
require(['app'], function(App) {
    App.start();
});