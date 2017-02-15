// Filename: xoces/app.js

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'regions',
  'apps/common/utilities',
  'jquery-ui'
], function($, _, Backbone, Marionette, RegionContainer, Utils){
    var XocesManager = new Marionette.Application();

    XocesManager.navigate = function(route,  options){
        options || (options = {});
        Backbone.history.navigate(route, options);
    };

    XocesManager.getCurrentRoute = function(){
        return Backbone.history.fragment
    };

    XocesManager.startSubApp = function(appName, args){
        var app = XocesManager.module(appName);
        if (app) {
            app.start(args);
        }
    };
    XocesManager.on('before:start', function () {
        XocesManager.regions = new RegionContainer();
    });


    XocesManager.on('start', function () {
        if (Backbone.history) {
            require(["router"], function () {
                XocesManager.Routers.trigger('start');

                Backbone.history.start();
            });
        }
    });

    $.ajaxSetup({ cache: false });

    return XocesManager;
});