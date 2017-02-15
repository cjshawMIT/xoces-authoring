// xoces/app/module-manager/models/module.js

define(["backbone", "apps/common/utilities"],
    function(Backbone, Utils){

    var Module = Backbone.Model.extend({
        url: function () {
            var baseUrl = Utils.learning() + 'modules/';

            return this.id ? baseUrl + this.id : baseUrl;
        }
    });
    return Module;
});