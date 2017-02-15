// xoces/app/objective-manager/collections/objective_prerequisites.js

define(["backbone",
        "apps/common/utilities",
        "apps/objective-manager/models/objective"],
    function(Backbone, Utils, ObjectiveModel){

    var Prerequisites = Backbone.Collection.extend({
        initialize: function (options) {
            this.options = options;
        },
        model: ObjectiveModel,
        url: function () {
            var baseUrl = Utils.learning() + 'objectives/';

            return this.options.parentId ? baseUrl + this.options.parentId + '/prerequisites/' : baseUrl;
        }
    });

    return Prerequisites;
});