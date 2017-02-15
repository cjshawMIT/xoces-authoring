// xoces/app/module-manager/collections/modules.js

define(["backbone",
        "apps/common/utilities",
        "apps/module-manager/models/module"],
    function(Backbone, Utils, ModuleModel){

    var Modules = Backbone.Collection.extend({
        model: ModuleModel,
        url: function () {
            var baseUrl = Utils.learning() + 'modules/';

            return baseUrl;
        }
    });

    return Modules;
});