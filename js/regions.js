// Filename: xoces/regions.js
define(['marionette'
], function (Marionette) {
    var RegionContainer = Marionette.LayoutView.extend({
        el: "#app-container",
        regions: {
            content: "#container-region",
            dialog: "#dialog-region",
            navbar: "#navbar-region"
        }
    });

    return RegionContainer;
});