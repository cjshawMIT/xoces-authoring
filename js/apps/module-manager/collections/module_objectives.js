// xoces/app/module-manager/collections/module_objectives.js

define(["backbone",
        "apps/common/utilities",
        "apps/objective-manager/models/objective"],
    function(Backbone, Utils, ObjectiveModel){

    var Objectives = Backbone.Collection.extend({
        initialize: function (options) {
            this.options = options;
        },
        model: ObjectiveModel,
        url: function () {
            var baseUrl = Utils.learning() + 'modules/';

            return this.options.parentId ? baseUrl + this.options.parentId + '/objectives/' : baseUrl;
        }
    });

    return Objectives;
});