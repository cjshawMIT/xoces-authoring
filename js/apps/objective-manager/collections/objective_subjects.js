// xoces/app/objective-manager/collections/objective_subjects.js

define(["backbone",
        "apps/common/utilities",
        "apps/subject-manager/models/subject"],
    function(Backbone, Utils, SubjectModel){

    var Subjects = Backbone.Collection.extend({
        initialize: function (options) {
            this.options = options;
        },
        model: SubjectModel,
        url: function () {
            var baseUrl = Utils.learning() + 'objectives/';

            return this.options.parentId ? baseUrl + this.options.parentId + '/subjects/' : baseUrl;
        }
    });

    return Subjects;
});