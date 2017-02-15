// xoces/app/objective-manager/collections/objective_modules.js

define(["backbone",
        "apps/common/utilities",
        "apps/module-manager/models/module"],
    function(Backbone, Utils, ModuleModel){

    var Modules = Backbone.Collection.extend({
        initialize: function (options) {
            this.options = options;
        },
        model: ModuleModel,
        url: function () {
            var baseUrl = Utils.learning() + 'objectives/';

            return this.options.parentId ? baseUrl + this.options.parentId + '/modules/' : baseUrl;
        }
    });

    return Modules;
});