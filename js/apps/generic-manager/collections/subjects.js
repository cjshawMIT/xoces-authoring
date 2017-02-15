// xoces/app/subject-manager/collections/subjects.js

define(["backbone",
        "apps/common/utilities",
        "apps/subject-manager/models/subject"],
    function(Backbone, Utils, SubjectModel){

    var Subjects = Backbone.Collection.extend({
        model: SubjectModel,
        url: function () {
            var baseUrl = Utils.learning() + 'subjects/';
            return baseUrl;
        }
    });

    return Subjects;
});