// xoces/app/subject-manager/models/subject.js

define(["backbone", "apps/common/utilities"],
    function(Backbone, Utils){

    var Subject = Backbone.Model.extend({
        url: function () {
            var baseUrl = Utils.learning() + 'subjects/';
            return this.id ? baseUrl + this.id : baseUrl;
        }
    });
    return Subject;
});