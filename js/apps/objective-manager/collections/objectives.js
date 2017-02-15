// xoces/app/objective-manager/collections/objectives.js

define(["backbone",
        "apps/common/utilities",
        "apps/objective-manager/models/objective"],
    function(Backbone, Utils, ObjectiveModel){

    var Objectives = Backbone.Collection.extend({
        model: ObjectiveModel,
        url: function () {
            var baseUrl = Utils.learning() + 'objectives/';

            return baseUrl;
        }
    });

    return Objectives;
});