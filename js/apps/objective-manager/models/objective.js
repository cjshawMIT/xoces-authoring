// xoces/app/objective-manager/models/objective.js

define(["backbone", "apps/common/utilities"],
    function(Backbone, Utils){

    var Objective = Backbone.Model.extend({
        url: function () {
            var baseUrl = Utils.learning() + 'objectives/';

            return this.id ? baseUrl + this.id : baseUrl;
        }
    });
    return Objective;
});